import { useObserver } from 'mobx-react';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  View,
  Alert,
  Image
} from 'react-native';
import { withTheme } from 'react-native-paper';
import { NavigationService } from '../../navigation';
import { ScreenNames } from '../../route/ScreenNames';
import TextNormal from '../../shared/components/Text/TextNormal';
import { useStores } from '../../store/useStore';
import { containerStyle } from '../../themes/styles';
import { styles } from './style';
import { firebase } from '@react-native-firebase/messaging';
import AxiosFetcher from '../../api/AxiosFetch';
import Video from 'react-native-video';
import IALocalStorage from '../../shared/utils/storage/IALocalStorage';
import Loading from '../../shared/components/Loading';
import { ToastHelper } from '../../shared/components/ToastHelper';
import Constant from '../../shared/utils/constant/Constant';
import HeaderFull from '../../shared/components/Header/HeaderFull';
import { colors } from '../../shared/utils/colors/colors';
import FastImage from 'react-native-fast-image';
import { ScreenWidth } from '../../shared/utils/dimension/Divices';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import moment from 'moment'
import { SPACINGS } from '../../themes';
import { FirebaseService } from '../../api/FirebaseService';
import { TimeHelper, ENUM_TIME_FORMAT } from '../../shared/utils/helper/timeHelper';

const SocialScreen = (props) => {
  const { colorsApp } = props.theme;
  const { t } = useTranslation();
  const { userStore } = useStores();
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [avt, setAvt] = useState(`${userStore?.userInfo?.avatar}`);
  const [allPost, setAllPost] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [lastItem, setLastItem] = useState(null);
  const [empty, setEmpty] = useState(null);


  useEffect(() => {
    receiverData();
    props?.navigation.addListener('willFocus', () => {
      receiverData();
    });
    getProfile();
  }, []);

  const getAllPost = async () => {
    setIsLoading(true);
    try {
      let allPost = await FirebaseService.queryAllItemBySchemaWithOrderedByChild(
        isBlog ? Constant.SCHEMA.BLOG : Constant.SCHEMA.SOCIAL,
        'timeInMillosecond',
        false,
        false,
        20
      );
      let arr = allPost.sort(function (x, y) {
        return y.timeInMillosecond - x.timeInMillosecond;
      });
      arr = arr.filter(item => item?.disable !== true);
      allPost.forEach(item => {
      })
      setIsLoading(false);
      setAllPost(arr);
      setIsFetching(false);
    } catch (err) {
      setAllPost([]);
      setIsLoading(false);
      setIsFetching(false);
    }
  };

  const receiverData = async () => {
    setIsLoading(true);
    await firebase
      .database()
      .ref(isBlog ? Constant.SCHEMA.BLOG : Constant.SCHEMA.SOCIAL)
      .orderByChild('timeInMillosecond')
      .limitToLast(10)
      .once('value', (snapshot) => {
        const data = snapshot.val() ? Object.values(snapshot.val()) : [];
        let arr = data.sort(function (x, y) {
          return y.timeInMillosecond - x.timeInMillosecond;
        });
        if (!isBlog) {
          arr = arr.filter(item => item?.disable !== true);
        };
        setIsLoading(false);
        setLastItem(arr[arr.length - 1]?.timeInMillosecond);
        setEmpty(data.length < 10);
        setAllPost(arr);
      });
  };

  const handleLoadmore = async () => {
    if (!isLoading && allPost.length > 0 && !empty) {
      setIsLoading(true);
      await firebase
        .database()
        .ref(isBlog ? Constant.SCHEMA.BLOG : Constant.SCHEMA.SOCIAL)
        .orderByChild('timeInMillosecond')
        .limitToLast(10)
        .endAt(lastItem)
        .once('value', (snapshot) => {
          const data = snapshot.val() ? Object.values(snapshot.val()) : [];
          let arr = data.sort(function (x, y) {
            return y.timeInMillosecond - x.timeInMillosecond;
          });
          if (!isBlog) {
            arr = arr.filter((item, index) => item?.disable !== true && index != 0);
          };
          setIsLoading(false);
          setLastItem(arr[arr.length - 1]?.timeInMillosecond);
          setEmpty(data.length < 10);
          setAllPost(allPost.concat(arr));
        });
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
      isBlog ? Constant.SCHEMA.BLOG : Constant.SCHEMA.SOCIAL,
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
        const newData = { ...val[0] };
        newData.likes = currentLike;
        FirebaseService.updateItem(
          isBlog ? Constant.SCHEMA.BLOG : Constant.SCHEMA.SOCIAL,
          post?.userId + '_' + post?.timeInMillosecond,
          newData,
        ).then((val1) => {
          //set New data
          let objIndex = allPost.findIndex((obj) => obj._id == post._id);
          let allPostNew = [...allPost];
          allPostNew[objIndex] = { ...newData };
          setAllPost(allPostNew);
        });
      }
    });
  };

  const noDataMessage = () => {
    return (
      <View style={{ display: "flex", justifyContent: "center", alignContent: "center" }}>
        <TouchableOpacity
          style={styles.postInput}
          onPress={() => {
            NavigationService.navigate(ScreenNames.NewPostScreen, { isBlog: isBlog });
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
        contentContainerStyle={{
          width: ScreenWidth,
          marginTop: 10,
          paddingBottom: 100
        }}
        onRefresh={() => { setIsFetching(true); getAllPost() }}
        ListEmptyComponent={() => noDataMessage()}
        refreshing={isFetching}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          if (0 === index) {
            return renderFirstPost(item);
          } else {
            return renderPost(item);
          }
        }}
        onEndReached={handleLoadmore}
        onEndReachedThreshold={0.1}
      />
    );
  };
  const del = (item) => {
    FirebaseService.queryAllItemBySchema(isBlog ? Constant.SCHEMA.BLOG : Constant.SCHEMA.SOCIAL).then(val => {
      const data = val ? Object.values(val) : [];
      var a = [];
      data?.forEach(a => {
        if (item?._id === a?._id) {
          // a.push(item);
          FirebaseService.updateItem(isBlog ? Constant.SCHEMA.BLOG : Constant.SCHEMA.SOCIAL, `${userStore.userInfo?.id}_${item?.timeInMillosecond}`, { ...item, disable: true })
          return;
        }
      })
      ToastHelper.showSuccess(t('chat.delOk'))
    })
  }
  const renderFirstPost = (item) => {
    let isLike = item.likes && item.likes.indexOf(userStore?.userInfo?.id) !== -1;
    let isToDay = TimeHelper.isToday(moment(item?.timeInMillosecond));
    const isAdmin = userStore?.userInfo?.phoneNumber?.includes('0955555555');
    const isBlog = props?.navigation?.state?.params?.isBlog;
    // if (isBlog) {
    //   if (!isAdmin) {
    //     return null;
    //   }
    // }
    return (
      <View key={item?.key}>
        {isBlog && !isAdmin ? null :
          <TouchableOpacity
            delayLongPress={0}
            onLongPress={() => {
              Alert.alert(t('chat.del'), '', [
                {
                  text: t('common.confirm'),
                  onPress: () => { del(item) }
                },
                {
                  text: t('common.cancel'),
                  onPress: () => { }
                },
              ])
            }}
            style={styles.postInput}
            onPress={() => {
              NavigationService.navigate(ScreenNames.NewPostScreen, { isBlog: isBlog });
            }}>
            <FastImage
              source={{
                uri: avt || Constant.MOCKING_DATA.NO_IMG_PLACE_HOLDER,
              }}
              resizeMode="cover"
              style={styles.avatar}
            />
            <TextNormal text={t('social.placeholder')}></TextNormal>
          </TouchableOpacity>}
        <TouchableOpacity
          onLongPress={() => {
            if (item?.userId === userStore?.userInfo?.id) {
              Alert.alert(t('chat.del'), '', [
                {
                  text: t('common.confirm'),
                  onPress: () => { del(item) }
                },
                {
                  text: t('common.cancel'),
                  onPress: () => { }
                },
              ])
            } else {
              Alert.alert(t('chat.del'), '', [
                {
                  text: t('message.reportUser'),
                  onPress: () => {
                    setTimeout(() => {
                      ToastHelper.showSuccess(t('common.doneB'))
                    }, 1500)
                  }
                },
                {
                  text: t('message.blockUser'),
                  onPress: () => {
                    setTimeout(() => {
                      ToastHelper.showSuccess(t('common.doneB'))
                    }, 1500)
                  }
                },
              ])
            }
          }}
          onPress={() => {
            NavigationService.navigate(ScreenNames.PostDetailScreen, {
              data: { ...item },
              isBlog: isBlog
            });
          }}
          style={[
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
                  uri: item.avatar || Constant.MOCKING_DATA.NO_IMG_PLACE_HOLDER,
                }}
                resizeMode="cover"
                style={styles.avatar}
              />
              <View style={{ display: 'flex', flexDirection: 'column' }}>
                <TextNormal
                  style={styles.postOwner}
                  text={item.name}></TextNormal>
                <TextNormal
                  style={styles.postTime}
                  text={moment(item.timeInMillosecond).format(
                    isToDay ? 'HH:mm' : ENUM_TIME_FORMAT.FULL,
                  )}></TextNormal>
              </View>
            </View>
            <View style={styles.postContent}>
              <TextNormal
                style={styles.contentTextStyle}
                text={item.content}
                numberOfLines={1000}
              />
              {item?.images && <View style={styles.contentImageStyle}>
                {item?.images &&
                  (item?.images[0]?.includes('PNG') ||
                    item?.images[0]?.includes('JPG') ||
                    item?.images[0]?.includes('JPEG') ||
                    item?.images[0]?.includes('HEIC') ||
                    item?.images[0]?.includes('heic') ||
                    item?.images[0]?.includes('png') ||
                    item?.images[0]?.includes('jpg') ||
                    item?.images[0]?.includes('jpeg')) ? (
                    <FlatList
                      numColumns={3}
                      keyExtractor={(item, index) => index.toString()}
                      style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center', alignSelf: 'center' }}
                      data={item?.images || []}
                      renderItem={({ a, index }) => {
                        return (
                          <FastImage
                            source={{
                              uri:
                                item?.images[index] ||
                                Constant.MOCKING_DATA.NO_IMG_PLACE_HOLDER,
                            }}
                            resizeMode="cover"
                            style={[item?.images?.length === 1 ? styles.postImages : { width: ScreenWidth * (1 / item?.images.length), height: ScreenWidth * (1 / item?.images.length), marginEnd: 10 }, { marginTop: 10 }]}
                          />
                        )
                      }} />
                  ) : (
                    <View
                      style={{
                        alignItems: "center",
                        width: ScreenWidth,
                        height: ScreenWidth
                      }}>
                      <Video
                        paused={true}
                        playWhenInactive={false}
                        playInBackground={false}
                        controls={true}
                        source={{ uri: item?.images?.[0] }}
                        style={{ width: ScreenWidth, height: ScreenWidth }}
                      />
                    </View>
                  )}
              </View>}
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
                    (item?.comments ? item?.comments.length : '0') + ' Comments'
                  }></TextNormal>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  borderTopWidth: 1,
                  paddingTop: SPACINGS.avg,
                  paddingBottom: SPACINGS.avg,
                  borderTopColor: colors.gray,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    clickLike(item);
                  }}
                  style={{ display: 'flex', flexDirection: 'row' }}>
                  <AntDesign
                    name={isLike ? 'like1' : 'like2'}
                    size={20}
                    color={isLike ? colors.purpleMain : colors.black}
                  />
                  <TextNormal text="Like"></TextNormal>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => { }}
                  style={{ display: 'flex', flexDirection: 'row' }}>
                  <EvilIcons name="comment" size={20} />
                  <TextNormal text="Comment"></TextNormal>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  const renderPost = (item) => {
    let isLike = item.likes && item.likes.indexOf(userStore?.userInfo?.id) !== -1;
    let isToDay = TimeHelper.isToday(moment(item?.timeInMillosecond));
    return (
      <TouchableOpacity key={item?.key}
        onLongPress={() => {
          if (item?.userId === userStore?.userInfo?.id) {
            Alert.alert(t('chat.del'), '', [
              {
                text: t('common.confirm'),
                onPress: () => { del(item) }
              },
              {
                text: t('common.cancel'),
                onPress: () => { }
              },
            ])
          }
        }
        }
        onPress={() => {
          NavigationService.navigate(ScreenNames.PostDetailScreen, {
            data: { ...item },
            isBlog: isBlog
          });
        }}
        style={[
          {
            borderTopColor: colors.purpleMain,
            borderTopWidth: 3,
            paddingTop: SPACINGS.large,
          },
        ]}>
        <View style={styles.postContainer}>
          <View style={styles.postHeader}>
            <TouchableOpacity onPress={() => { }}>
              <FastImage
                source={{
                  uri:
                    item.avatar ||
                    Constant.MOCKING_DATA.NO_IMG_PLACE_HOLDER,
                }}
                resizeMode="cover"
                style={styles.avatar}
              />
            </TouchableOpacity>
            <View style={{ display: 'flex', flexDirection: 'column' }}>
              <TextNormal
                style={styles.postOwner}
                text={item.name}></TextNormal>
              <TextNormal
                style={styles.postTime}
                text={moment(item.timeInMillosecond).format(
                  isToDay ? 'HH:mm' : ENUM_TIME_FORMAT.FULL,
                )}></TextNormal>
            </View>
          </View>
          <View style={styles.postContent}>
            <TextNormal
              style={styles.contentTextStyle}
              text={item.content}
              numberOfLines={100}
            />
            {item?.images?.length > 0 ? <View style={styles.contentImageStyle}>
              {item?.images && (item?.images[0]?.includes('PNG') || item?.images[0]?.includes('HEIC') || item?.images[0]?.includes('heic') || item?.images[0]?.includes('JPG') || item?.images[0]?.includes('JPEG') ||
                item?.images[0]?.includes('png') || item?.images[0]?.includes('jpg') || item?.images[0]?.includes('jpeg')) ?
                <FastImage
                  source={{
                    uri:
                      item?.images[0] ||
                      Constant.MOCKING_DATA.NO_IMG_PLACE_HOLDER,
                  }}
                  resizeMode="cover"
                  resizeMethod="resize"
                  style={styles.postImages}
                /> :
                <View
                  style={{
                    alignItems: "center",
                    width: ScreenWidth
                  }}>
                  {item?.images?.[0] ? <Video
                    paused={true}
                    playWhenInactive={false}
                    playInBackground={false}
                    controls={true}
                    disableFocus
                    source={{ uri: item?.images?.[0] }}
                    style={{ width: ScreenWidth, height: ScreenWidth }}
                  /> : null}
                </View>
              }
            </View> : null}
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
                paddingBottom: SPACINGS.avg,
                borderTopColor: colors.gray,
              }}>
              <TouchableOpacity
                onPress={() => {
                  clickLike(item);
                }}
                style={{ display: 'flex', flexDirection: 'row' }}>
                <AntDesign
                  name={isLike ? 'like1' : 'like2'}
                  size={20}
                  color={isLike ? colors.purpleMain : colors.black}
                />
                <TextNormal text="Like"></TextNormal>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  NavigationService.navigate(ScreenNames.PostDetailScreen, {
                    data: { ...item },
                    isBlog: isBlog
                  });
                }}
                style={{ display: 'flex', flexDirection: 'row' }}>
                <EvilIcons name="comment" size={20} />
                <TextNormal text="Comment"></TextNormal>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  const isBlog = props?.navigation?.state?.params?.isBlog;
  return useObserver(() => (
    <View style={[containerStyle.default]}>
      <StatusBar barStyle={colorsApp.statusBar} />
      <SafeAreaView>
        <HeaderFull title={t(isBlog ? 'explorer.admin' : 'social.title')} hasButton={true} />
          {renderAllPost()}
      </SafeAreaView>
      {isLoading && <Loading />}
    </View>
  ));
};
export default withTheme(SocialScreen);
