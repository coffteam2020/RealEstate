import {useObserver} from 'mobx-react';
import React, {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  View,
  RefreshControl,
  Dimensions,
} from 'react-native';
import {List, ListItem} from 'react-native-elements';
import {withTheme} from 'react-native-paper';
import {images} from '../../../assets';
import {NavigationService} from '../../navigation';
import {ScreenNames} from '../../route/ScreenNames';
import TextNormal from '../../shared/components/Text/TextNormal';
import {useStores} from '../../store/useStore';
import {containerStyle} from '../../themes/styles';
import * as Animatable from 'react-native-animatable';
import TrackPlayer from 'react-native-track-player';
import {styles} from './style';
import {firebase} from '@react-native-firebase/messaging';
import AxiosFetcher from '../../api/AxiosFetch';
import IALocalStorage from '../../shared/utils/storage/IALocalStorage';
import Loading from '../../shared/components/Loading';
import {ToastHelper} from '../../shared/components/ToastHelper';
import Constant from '../../shared/utils/constant/Constant';
import Speaker from '../../shared/components/Speaker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HeaderFull from '../../shared/components/Header/HeaderFull';
import {colors} from '../../shared/utils/colors/colors';
import FastImage from 'react-native-fast-image';
import {ScreenWidth, ScreenHeight} from '../../shared/utils/dimension/Divices';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import moment from 'moment'
import {SPACINGS, FONTSIZES} from '../../themes';
import { FirebaseService } from '../../api/FirebaseService';

const SocialScreen = (props) => {
  const {colorsApp} = props.theme;
  const {t} = useTranslation();
  const {userStore} = useStores();
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [avt, setAvt] = useState('');
  const [allPost, setAllPost] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  
  useEffect(() => {
    props?.navigation.addListener('willFocus', () => {
      getProfile();
      getAllPost();
    });
    getProfile();
    getAllPost();
  }, []);
  const getAllPost = async () => {
    try {
      let allPost = await FirebaseService.queryAllItemBySchemaWithOrderedByChild(
        Constant.SCHEMA.SOCIAL,
        'timeInMillosecond',
        false,
        false,
      );
      let arr = allPost.sort(function(x, y){
        return y.timeInMillosecond - x.timeInMillosecond;
      });
      setAllPost(arr);
      setIsFetching(false);
    } catch (err) {
      setAllPost([]);
      setIsFetching(false);
    }
  };
  const getProfile = async () => {
    let userInfo = await IALocalStorage.getDetailUserInfo();
    setIsLoading(true);
    AxiosFetcher({
      method: 'GET',
      url: 'user/' + userInfo?.id,
      hasToken: true,
    })
      .then((val) => {
        console
        if (val?.data !== '') {
          setIsLoading(false);
          userStore.userInfo = val;
          setAvt(val?.avatar);
        } else {
          setIsLoading(false);
          ToastHelper.showError(t('account.getInfoErr'));
        }
      })
      .catch(() => {
        setIsLoading(false);
        ToastHelper.showError(t('account.getInfoErr'));
      });
  };

  const clickLike = (post) => {
    let userDetail = userStore?.userInfo;
    FirebaseService.queryAllItemBySchemaWithSpecifiedChild(
      Constant.SCHEMA.SOCIAL,
      '_id',
      post._id,
      false,
      false,
    ).then((val) => {
      if (val && val.length > 0) {
        let currentLike = val[0].likes ? [...val[0].likes] : [];
        if (currentLike.indexOf(userDetail?.id) !== -1) {
          currentLike = currentLike.filter((item) => item !== userDetail?.id);
        } else {
          currentLike.push(userDetail?.id);
        }
        const newData = {...val[0]};
        newData.likes = currentLike;
        FirebaseService.updateItem(
          Constant.SCHEMA.SOCIAL,
          post?.userId + '_' + post?.timeInMillosecond,
          newData,
        ).then((val1) => {
          //set New data
          let objIndex = allPost.findIndex((obj) => obj._id == post._id);
          let allPostNew = [...allPost];
          allPostNew[objIndex] = {...newData};
          setAllPost(allPostNew);
        });
      }
    });
  };

  const renderPostButton = () => {
    return (
        <TouchableOpacity
          style={styles.postInput}
          onPress={() => {
            console.log('open View Post');
            NavigationService.navigate(ScreenNames.NewPostScreen);
          }}>
          <FastImage
            source={{
              uri:
                avt ||
                Constant.MOCKING_DATA.NO_IMG_PLACE_HOLDER,
            }}
            resizeMode="cover"
            style={styles.avatar}
          />
          <TextNormal text={t('social.placeholder')}></TextNormal>
        </TouchableOpacity>
    );
  };

  const noDataMessage = () => {
    return (
      <View style={{display: "flex", justifyContent: "center", alignContent: "center"}}>
        <TouchableOpacity
          style={styles.postInput}
          onPress={() => {
            console.log('open View Post');
            NavigationService.navigate(ScreenNames.NewPostScreen);
          }}>
          <FastImage
            source={{
              uri:
                avt ||
                Constant.MOCKING_DATA.NO_IMG_PLACE_HOLDER,
            }}
            resizeMode="cover"
            style={styles.avatar}
          />
          <TextNormal text={t('social.placeholder')}></TextNormal>
        </TouchableOpacity>
        <TextNormal
          style={styles.noDataMessage}
          text={t('social.nodata')}
          numberOfLines={100}
        />
      </View>
    );
  };

  const renderAllPost = () => {
    return (
      <FlatList
        data={allPost}
        scrollEnabled
        style={{
          width: ScreenWidth,
          height: ScreenHeight,
          marginTop: 10,
        }}
        onRefresh={() => {
          setIsFetching(true);
          getAllPost();
        }}
        ListEmptyComponent={() => noDataMessage()}
        refreshing={isFetching}
        keyExtractor={(item) => item._id}
        renderItem={({item, index}) => {
          console.log(item)
          if(0 === index){
            return renderFirstPost(item);
          }else{
            return renderPost(item);
          }
        }}
      />
    );
  };

  const renderFirstPost = (item) =>{
    let isLike =
            item.likes && item.likes.indexOf(userStore?.userInfo?.id) !== -1;
    return (
      <>
      <TouchableOpacity
          style={styles.postInput}
          onPress={() => {
            NavigationService.navigate(ScreenNames.NewPostScreen);
          }}>
          <FastImage
            source={{
              uri:
                avt ||
                Constant.MOCKING_DATA.NO_IMG_PLACE_HOLDER,
            }}
            resizeMode="cover"
            style={styles.avatar}
          />
          <TextNormal text={t('social.placeholder')}></TextNormal>
        </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          NavigationService.navigate(ScreenNames.PostDetailScreen, {
            data: {...item},
          });
        }}
        style={[
          containerStyle.defaultMarginBottom,
          containerStyle.shadow,
          {
            borderTopColor: colors.purpleMain,
            borderTopWidth: 3,
            paddingTop: SPACINGS.large,
          },
        ]}>
        <View style={styles.postContainer}>
          <View style={styles.postHeader}>
            <FastImage
              source={{
                uri:
                  item.avatar ||
                  Constant.MOCKING_DATA.NO_IMG_PLACE_HOLDER,
              }}
              resizeMode="cover"
              style={styles.avatar}
            />
            <View style={{display: 'flex', flexDirection: 'column'}}>
              <TextNormal
                style={styles.postOwner}
                text={item.name}></TextNormal>
              <TextNormal
                style={styles.postTime}
                text={moment(item.timeInMillosecond).format(
                  'HH:mm',
                )}></TextNormal>
            </View>
          </View>
          <View style={styles.postContent}>
            <TextNormal
              style={styles.contentTextStyle}
              text={item.content}
              numberOfLines={100}
            />
            <View style={styles.contentImageStyle}>
              {item?.images && (
                <FastImage
                  source={{
                    uri:
                      item?.images[0] ||
                      Constant.MOCKING_DATA.NO_IMG_PLACE_HOLDER,
                  }}
                  resizeMode="cover"
                  style={styles.postImages}
                />
              )}
            </View>
          </View>
          <View style={styles.postFooter}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: SPACINGS.small,
                marginBottom: SPACINGS.small,
                marginLeft: SPACINGS.large,
                marginRight: SPACINGS.large,
              }}>
              <TextNormal
                text={
                  (item?.likes ? item?.likes?.length : '0') + ' Likes'
                }></TextNormal>
              <TextNormal
                text={
                  (item?.comments ? item?.comments.length : '0') +
                  ' Comments'
                }></TextNormal>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-around',
                borderTopWidth: 1,
                paddingTop: SPACINGS.avg,
                borderTopColor: colors.gray,
              }}>
              <TouchableOpacity
                onPress={() => {
                  clickLike(item);
                }}
                style={{display: 'flex', flexDirection: 'row'}}>
                <AntDesign
                  name={isLike ? 'like1' : 'like2'}
                  size={20}
                  color={isLike ? colors.purpleMain : colors.black}
                />
                <TextNormal text="Like"></TextNormal>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  console.log('comment');
                  // navigate to Post Detail
                }}
                style={{display: 'flex', flexDirection: 'row'}}>
                <EvilIcons name="comment" size={20} />
                <TextNormal text="Comment"></TextNormal>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </>
    );
  }
  const renderPost = (item) =>{
    let isLike =
            item.likes && item.likes.indexOf(userStore?.userInfo?.id) !== -1;
    return (
      <TouchableOpacity
        onPress={() => {
          NavigationService.navigate(ScreenNames.PostDetailScreen, {
            data: {...item},
          });
        }}
        style={[
          containerStyle.defaultMarginBottom,
          containerStyle.shadow,
          {
            borderTopColor: colors.purpleMain,
            borderTopWidth: 3,
            paddingTop: SPACINGS.large,
          },
        ]}>
        <View style={styles.postContainer}>
          <View style={styles.postHeader}>
            <FastImage
              source={{
                uri:
                  item.avatar ||
                  Constant.MOCKING_DATA.NO_IMG_PLACE_HOLDER,
              }}
              resizeMode="cover"
              style={styles.avatar}
            />
            <View style={{display: 'flex', flexDirection: 'column'}}>
              <TextNormal
                style={styles.postOwner}
                text={item.name}></TextNormal>
              <TextNormal
                style={styles.postTime}
                text={moment(item.timeInMillosecond).format(
                  'HH:mm',
                )}></TextNormal>
            </View>
          </View>
          <View style={styles.postContent}>
            <TextNormal
              style={styles.contentTextStyle}
              text={item.content}
              numberOfLines={100}
            />
            <View style={styles.contentImageStyle}>
              {item?.images && (
                <FastImage
                  source={{
                    uri:
                      item?.images[0] ||
                      Constant.MOCKING_DATA.NO_IMG_PLACE_HOLDER,
                  }}
                  resizeMode="cover"
                  style={styles.postImages}
                />
              )}
            </View>
          </View>
          <View style={styles.postFooter}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: SPACINGS.small,
                marginBottom: SPACINGS.small,
                marginLeft: SPACINGS.large,
                marginRight: SPACINGS.large,
              }}>
              <TextNormal
                text={
                  (item?.likes ? item?.likes?.length : '0') + ' Likes'
                }></TextNormal>
              <TextNormal
                text={
                  (item?.comments ? item?.comments.length : '0') +
                  ' Comments'
                }></TextNormal>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-around',
                borderTopWidth: 1,
                paddingTop: SPACINGS.avg,
                borderTopColor: colors.gray,
              }}>
              <TouchableOpacity
                onPress={() => {
                  clickLike(item);
                }}
                style={{display: 'flex', flexDirection: 'row'}}>
                <AntDesign
                  name={isLike ? 'like1' : 'like2'}
                  size={20}
                  color={isLike ? colors.purpleMain : colors.black}
                />
                <TextNormal text="Like"></TextNormal>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  console.log('comment');
                  // navigate to Post Detail
                }}
                style={{display: 'flex', flexDirection: 'row'}}>
                <EvilIcons name="comment" size={20} />
                <TextNormal text="Comment"></TextNormal>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  return useObserver(() =>(
    <View style={[containerStyle.default]}>
      <StatusBar barStyle={colorsApp.statusBar} />
      <SafeAreaView>
        <HeaderFull title={t('social.title')} />
        <ScrollView contentContainerStyle={styles.content}>
          {renderAllPost()}
        </ScrollView>
      </SafeAreaView>
      {isLoading && <Loading />}
    </View>
  ));
  };
export default withTheme(SocialScreen);
