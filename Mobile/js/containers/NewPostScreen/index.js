import {useObserver} from 'mobx-react';
import React, {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {
  TextInput,
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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
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
      {id: "1", name: "aa", comment: "aaa hay quá"},
      {id: "2", name: "bb", comment: "aaa hay quá"},
      {id: "3", name: "cc", comment: "aaa hay quá"},
      {id: "4", name: "dd", comment: "aaa hay quá"}
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
      {id: "1", name: "aa", comment: "aaa hay quá"},
      {id: "2", name: "bb", comment: "aaa hay quá"},
      {id: "3", name: "cc", comment: "aaa hay quá"},
      {id: "4", name: "dd", comment: "aaa hay quá"}
    ]
  },
];

const NewPostScreen = (props) => {
  const {colorsApp} = props.theme;
  const {t} = useTranslation();
  const {userStore} = useStores();
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [avt, setAvt] = useState('');
  const [content, setContent] = useState('');


  const createNewPost = () =>{
    console.log('createNewPost');
  }

  const renderPostInput = () => {
    return (
      <View>
        <TextInput
          value={content || ''}
          returnKeyType="done"
          maxLength={1000}
          onChangeText={(text) => setContent(text)}
          multiline
          numberOfLines={100}
          style={[
            containerStyle.defaultMarginTopSmall,
            containerStyle.textDefaultNormal,
            containerStyle.paddingDefault,
            {
              height: ScreenHeight / 2 - 30,
              width: ScreenWidth * 0.9,
              backgroundColor: colors.red
            },
          ]}
        />
      </View>
    );
  };

  const renderImagePicker = () => {
    return (
      <TouchableOpacity style={styles.toolbar} onPress={() => {console.log('1231321321')}}>
        <MaterialIcons name="photo-library" size={40}></MaterialIcons>
      </TouchableOpacity>
    );
  };

  const rightIco = (<TextNormal text={t('social.post')}></TextNormal>)
  return (
    <View style={[containerStyle.default]}>
      <StatusBar barStyle={colorsApp.statusBar} />
      <SafeAreaView>
        <HeaderFull title={t('social.createpost')} hasButton rightIco={rightIco} onPress={() => createNewPost()}/>
        <View style={styles.content}>
          {renderPostInput()}
          {renderImagePicker()}
        </View>
      </SafeAreaView>
      {isLoading && <Loading />}
    </View>
  );
  };
export default withTheme(NewPostScreen);
