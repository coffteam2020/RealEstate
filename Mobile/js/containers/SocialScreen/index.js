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

const MOCK = [
  {
	id: 0,
	createdAt: 1598281346356,
    firstName: 'Mayuko',
    lastName: 'Nashel',
    avatar: 'https://i1.sndcdn.com/avatars-000143568666-ksxxz6-t500x500.jpg',
    content:
      'I want to make a openable chances for everyone wanna deal with my property. Home is da best',
    images: [
      'https://scontent-hkt1-1.xx.fbcdn.net/v/t1.0-9/118463986_10223180469921675_7101042475717980321_o.jpg?_nc_cat=100&_nc_sid=8024bb&_nc_ohc=O0s6CLHuetQAX9UVwKr&_nc_ht=scontent-hkt1-1.xx&oh=35e4ab9112f4b31cbb7d285c85bc0c17&oe=5F6783EE',
      'https://scontent-hkt1-1.xx.fbcdn.net/v/t1.0-9/117954125_10223180469641668_1258233496962219199_o.jpg?_nc_cat=108&_nc_sid=8024bb&_nc_ohc=JaO5bHQyd7EAX-c2Nb9&_nc_ht=scontent-hkt1-1.xx&oh=3106da91704148d077ab7e4b03cf6def&oe=5F69DC2F',
      'https://scontent.fsgn5-7.fna.fbcdn.net/v/t1.0-9/117906997_10223180470001677_3550485438271917420_o.jpg?_nc_cat=103&_nc_sid=8024bb&_nc_ohc=vpDDAXY9ZH0AX-cPDY_&_nc_ht=scontent.fsgn5-7.fna&oh=a489b1a814b6f0d367473c9a146af2cb&oe=5F6B3B65',
    ],
    likes : [
      1,2,3,4,5
    ],
    comments: [
      {id: "1", name: "Mayuko Nashel", avatar: 'https://i1.sndcdn.com/avatars-000143568666-ksxxz6-t500x500.jpg' , commentContent: 'Một người bạn Ý từng nói với mình, "tôi sợ là sau này chết đi mà được biết ít quá về thế giới"'},
      {id: "2", name: "Mayuko Nashel", avatar: 'https://i1.sndcdn.com/avatars-000143568666-ksxxz6-t500x500.jpg' , commentContent: 'Một người bạn Ý từng nói với mình, "tôi sợ là sau này chết đi mà được biết ít quá về thế giới"'},
      {id: "3", name: "Mayuko Nashel", avatar: 'https://i1.sndcdn.com/avatars-000143568666-ksxxz6-t500x500.jpg' , commentContent: 'Một người bạn Ý từng nói với mình, "tôi sợ là sau này chết đi mà được biết ít quá về thế giới"'},
      {id: "4", name: "Mayuko Nashel", avatar: 'https://i1.sndcdn.com/avatars-000143568666-ksxxz6-t500x500.jpg' , commentContent: 'Một người bạn Ý từng nói với mình, "tôi sợ là sau này chết đi mà được biết ít quá về thế giới"'}
    ]
  },
  {
	id: 1,
	createdAt:  1598281346356,
    firstName: 'Lê ',
    lastName: 'Thuận',
    avatar: 'https://i1.sndcdn.com/avatars-000143568666-ksxxz6-t500x500.jpg',
    content:
      'Một người bạn Ý từng nói với mình, "tôi sợ là sau này chết đi mà được biết ít quá về thế giới". Là một người có máu xê dịch, mình hiểu những gì anh ấy nói. Và vì thế giới rất rộng mà ta chỉ được sống có một lần, những người ham đi luôn có một khát vọng cháy bỏng la lên đường. Và nỗi đau khổ lớn nhất đối với họ chính là nhìn cuộc đời này trôi qua mà ta cứ dính chặt ở một chỗ, hoặc có quá ít cơ hội để nhìn thế giới bằng chính mắt mình.',
    images: [
      'https://scontent-hkt1-1.xx.fbcdn.net/v/t1.0-9/118463986_10223180469921675_7101042475717980321_o.jpg?_nc_cat=100&_nc_sid=8024bb&_nc_ohc=O0s6CLHuetQAX9UVwKr&_nc_ht=scontent-hkt1-1.xx&oh=35e4ab9112f4b31cbb7d285c85bc0c17&oe=5F6783EE',
      'https://scontent-hkt1-1.xx.fbcdn.net/v/t1.0-9/117954125_10223180469641668_1258233496962219199_o.jpg?_nc_cat=108&_nc_sid=8024bb&_nc_ohc=JaO5bHQyd7EAX-c2Nb9&_nc_ht=scontent-hkt1-1.xx&oh=3106da91704148d077ab7e4b03cf6def&oe=5F69DC2F',
      'https://scontent.fsgn5-7.fna.fbcdn.net/v/t1.0-9/117906997_10223180470001677_3550485438271917420_o.jpg?_nc_cat=103&_nc_sid=8024bb&_nc_ohc=vpDDAXY9ZH0AX-cPDY_&_nc_ht=scontent.fsgn5-7.fna&oh=a489b1a814b6f0d367473c9a146af2cb&oe=5F6B3B65',
    ],
    likes : [
      1,2,3,4,5
    ],
    comments: [
      {id: "1", name: "Mayuko Nashel", avatar: 'https://i1.sndcdn.com/avatars-000143568666-ksxxz6-t500x500.jpg' , commentContent: 'Một người bạn Ý từng nói với mình, "tôi sợ là sau này chết đi mà được biết ít quá về thế giới"'},
      {id: "2", name: "Mayuko Nashel", avatar: 'https://i1.sndcdn.com/avatars-000143568666-ksxxz6-t500x500.jpg' , commentContent: 'Một người bạn Ý từng nói với mình, "tôi sợ là sau này chết đi mà được biết ít quá về thế giới"'},
      {id: "3", name: "Mayuko Nashel", avatar: 'https://i1.sndcdn.com/avatars-000143568666-ksxxz6-t500x500.jpg' , commentContent: 'Một người bạn Ý từng nói với mình, "tôi sợ là sau này chết đi mà được biết ít quá về thế giới"'},
      {id: "4", name: "Mayuko Nashel", avatar: 'https://i1.sndcdn.com/avatars-000143568666-ksxxz6-t500x500.jpg' , commentContent: 'Một người bạn Ý từng nói với mình, "tôi sợ là sau này chết đi mà được biết ít quá về thế giới"'}
    ]
  },
];

const SocialScreen = (props) => {
  const {colorsApp} = props.theme;
  const {t} = useTranslation();
  const {userStore} = useStores();
  const [index, setIndex] = React.useState(0);
  const [modelSelect, setModalSelect] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [avt, setAvt] = useState('');

  useEffect(() => {
    props?.navigation.addListener('willFocus', () => {
      getProfile();
    });
    getProfile();
  }, []);
  const getProfile = async () => {
    let userInfo = await IALocalStorage.getDetailUserInfo();
    console.log("@@@@@")
    console.log(userInfo);
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

  const renderPost = () => {
    return (
      <FlatList
        data={MOCK}
        scrollEnabled
        style={{
          width: ScreenWidth,
          height: ScreenHeight,
          marginTop: 10,
        }}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => {
          let isLike = item.likes.indexOf(userStore?.userInfo?.id) !== -1;
          return (
            <TouchableOpacity
              onPress={() => {
                NavigationService.navigate(ScreenNames.PostDetailScreen, {data: {...item}})
              }}
              style={[
                containerStyle.defaultMarginBottom,
                containerStyle.shadow,
                {borderTopColor: colors.purpleMain,
                borderTopWidth: 3,
                paddingTop: SPACINGS.large,
                }
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
                  <View style={{display: "flex", flexDirection: "column"}}>
                    <TextNormal style={styles.postOwner}
                      text={`${item.firstName} ${item.lastName}`}></TextNormal>
                    <TextNormal style={styles.postTime}
                      text={moment(item.createdAt).format("HH:mm")}></TextNormal>
                  </View>
                </View>
                <View style={styles.postContent}>
                  <TextNormal
                    style={styles.contentTextStyle}
                    text={item.content}
                    numberOfLines={100}/>
                  <View style={styles.contentImageStyle}>
                    <FastImage
                      source={{
                        uri:
                          item?.images[0] ||
                          Constant.MOCKING_DATA.NO_IMG_PLACE_HOLDER,
                      }}
                      resizeMode="cover"
                      style={styles.postImages}
                    />
                  </View>
                </View>
                <View style={styles.postFooter}>
                  <View style={{display: 'flex', flexDirection: 'row', justifyContent: "space-between", marginTop: SPACINGS.small, marginBottom: SPACINGS.small, marginLeft: SPACINGS.large, marginRight: SPACINGS.large}}>
                    <TextNormal text={`${item.likes.length} Likes`}></TextNormal>
                    <TextNormal text={`${item.comments.length} Comments`}></TextNormal>
                  </View>
                  <View style={{display: 'flex', flexDirection: 'row', justifyContent: "space-around", borderTopWidth: 1, paddingTop: SPACINGS.avg, borderTopColor: colors.gray,}}>
                    <TouchableOpacity
                      onPress={() => {
                        console.log('Like');
                      }}
                      style={{display: 'flex', flexDirection: 'row'}}>
                      <AntDesign name={isLike ? "like1" : "like2"} size={20} color={isLike ? colors.purpleMain: ""}/>
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
        }}
      />
    );
  };

  return useObserver(() =>(
    <View style={[containerStyle.default]}>
      <StatusBar barStyle={colorsApp.statusBar} />
      <SafeAreaView>
        <HeaderFull title={t('social.title')} />
        <ScrollView contentContainerStyle={styles.content}>
          {renderPostButton()}
          {renderPost()}
        </ScrollView>
      </SafeAreaView>
      {isLoading && <Loading />}
    </View>
  ));
  };
export default withTheme(SocialScreen);
