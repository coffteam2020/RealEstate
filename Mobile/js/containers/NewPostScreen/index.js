import {useObserver} from 'mobx-react';
import React, {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Platform,
  TextInput,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  View,
  Image,
  RefreshControl,
  Dimensions,
  KeyboardAvoidingView
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
import {SPACINGS, FONTSIZES, RADIUS} from '../../themes';
import ImagePicker from 'react-native-image-picker';
import {uploadFileToFireBase} from '../../shared/utils/firebaseStorageUtils';
import {FirebaseService} from '../../api/FirebaseService';
import GridList from 'react-native-grid-list';

var uuid = require('uuid');
let childTemp = '';
const NewPostScreen = (props) => {
  const {colorsApp} = props.theme;
  const {t} = useTranslation();
  const {userStore} = useStores();
  const [userDetail, setUserDetail] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [avt, setAvt] = useState('');
  const [content, setContent] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [images, setImages] = useState([]);

  const [newPost, setNewPost] = useState({});

  const IMAGE_CONFIG = {
    title: t('imagePicker.name'),
    cancelButtonTitle: t('common.cancel'),
    takePhotoButtonTitle: t('imagePicker.camera'),
    chooseFromLibraryButtonTitle: t('imagePicker.name'),
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

  useEffect(() => {
    props?.navigation.addListener('willFocus', () => {
      getProfile();
    });
    getProfile();
  }, []);
  const getProfile = async () => {
    let userInfo = await IALocalStorage.getDetailUserInfo();
    setIsLoading(true);
    AxiosFetcher({
      method: 'GET',
      url: 'user/' + userInfo?.id,
      hasToken: true,
    })
      .then((val) => {
        console.log(val)
        if (val?.data !== '') {
          setIsLoading(false);
          userStore.userInfo = val;
          setUserDetail(val);
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

  const openImagePicker = () => {
    ImagePicker.launchImageLibrary(IMAGE_CONFIG, (response) => {
      // console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        setIsLoading(true);
        setSelectedImages([{ uri: response.uri}]);
        Promise.resolve(uploadFileToFireBase(response, userDetail?.id))
          .then((val) => {
            console.log('@@@@openImagePicker@@@@@');
            console.log(val);
            setImages([...images, val])
            setIsLoading(false);
          })
          .catch((error) => {
            console.log(error.message);
            ToastHelper.showError(t('error.common'));
            setIsLoading(false);
          });
      }
    });
  };


  const openCamera = () => {
    ImagePicker.launchCamera(IMAGE_CONFIG, (response) => {
      // console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        setIsLoading(true);
        setSelectedImages([{ uri: response.uri}]);
        Promise.resolve(uploadFileToFireBase(response, userDetail?.id))
          .then((val) => {
            console.log('@@@@openCamera@@@@@');
            console.log(val);
            setImages([...images, val])
            setIsLoading(false);
          })
          .catch((error) => {
            console.log(error.message);
            ToastHelper.showError(t('error.common'));
            setIsLoading(false);
          });
      }
    });
  };


  const createNewPost = () =>{
    let currentTime = new Date().getTime();
    let post = {
      _id: uuid.v4(),
      userId: userDetail?.id,
      name: userDetail?.name,
      avatar: userDetail?.avatar || Constant.MOCKING_DATA.ANY_AVATAR,
      timeInMillosecond: currentTime,
      createdAt: moment().utc().format('YYYY-MM-DDTHH:mm:ssZ'),
      createdOn: moment().format("YYYY-MM-DD'T'HH:mm:ssZ"),
      modifiedOn: moment().format("YYYY-MM-DD'T'HH:mm:ssZ"),
      content: content,
    };
    console.log(images)
    if(images.length > 0){
      post.images = images;
    }
    console.log('createNewPost');
    if (
      post?.content  &&
      post?.content.replace(' ', '') === ''
    ) {
      return;
    }
    console.log(post);
    childTemp = userDetail?.id +'_'+currentTime;
    try {
      setIsLoading(true);
      FirebaseService.pushNewItemWithChildKey(
        Constant.SCHEMA.SOCIAL,
        childTemp,
        post,
        false
      ).then(val =>{
        setIsLoading(false);
        console.log(val);
        NavigationService.goBack();
      });
      return;
    } catch (err) {
      console.log('err' + err?.message);
    }
  }

  const renderPostInput = () => {
    return (
      <View>
        <TextInput
          value={content || ''}
          returnKeyType="done"
          maxLength={3000}
          onChangeText={(text) => setContent(text)}
          multiline
          numberOfLines={100}
          style={[
            containerStyle.defaultMarginTopSmall,
            containerStyle.textDefaultNormal,
            containerStyle.paddingDefault,
            {
              height: ScreenHeight * 0.5,
              width: ScreenWidth * 0.9,
              backgroundColor: colors.gray_bg,
              borderRadius: RADIUS.default
            },
          ]}
        />
      </View>
    );
  };

  const renderImagePicker = () => {
    return (
      <View style={{display: "flex", flexDirection: "row", 
      width: ScreenWidth * 0.9}}>
        <TouchableOpacity
          onPress={() => {
            openImagePicker();
          }}>
          <MaterialIcons name="photo-library" size={40}></MaterialIcons>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            openCamera();
          }}>
          <MaterialIcons name="camera-alt" size={40}></MaterialIcons>
        </TouchableOpacity>
      </View>
    );
  };

  const renderItems = ({item, index}) => (
    <Image style={styles.image} source={{uri: item.uri}} resizeMode="cover" />
  );

  const renderImageSelected = () => {
    return (
      <FastImage style={styles.image} source={{uri: selectedImages[0].uri}} resizeMode="cover" />
    );
  };

  
  const rightIco = isLoading ? null : (<TextNormal text={t('social.post')}></TextNormal>);
  
  return (
    <View style={[containerStyle.default]}>
      <StatusBar barStyle={colorsApp.statusBar} />
      <SafeAreaView>
        <HeaderFull title={t('social.createpost')} hasButton rightIco={rightIco} onPress={() => createNewPost()}/>
        <ScrollView contentContainerStyle={styles.content}>
          {renderPostInput()}
          {renderImagePicker()}
          {selectedImages.length > 0 && renderImageSelected()}
        </ScrollView>
      </SafeAreaView>
      {isLoading && <Loading />}
    </View>
  );
  };
export default withTheme(NewPostScreen);
