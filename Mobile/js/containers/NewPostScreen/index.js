import { useObserver } from 'mobx-react';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Platform,
  TextInput,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  View,
  Image,
  FlatList
} from 'react-native';
import { List, ListItem } from 'react-native-elements';
import { withTheme } from 'react-native-paper';
import { images } from '../../../assets';
import { NavigationService } from '../../navigation';
import { ScreenNames } from '../../route/ScreenNames';
import TextNormal from '../../shared/components/Text/TextNormal';
import { useStores } from '../../store/useStore';
import { containerStyle } from '../../themes/styles';
import * as Animatable from 'react-native-animatable';
import TrackPlayer from 'react-native-track-player';
import GradientButton from '../../shared/components/Buttons/GradientButton'
import { styles } from './style';
import { firebase } from '@react-native-firebase/messaging';
import AxiosFetcher from '../../api/AxiosFetch';
import IALocalStorage from '../../shared/utils/storage/IALocalStorage';
import Loading from '../../shared/components/Loading';
import { ToastHelper } from '../../shared/components/ToastHelper';
import Constant from '../../shared/utils/constant/Constant';
import Speaker from '../../shared/components/Speaker';
import Video from 'react-native-video';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HeaderFull from '../../shared/components/Header/HeaderFull';
import { colors } from '../../shared/utils/colors/colors';
import FastImage from 'react-native-fast-image';
import { ScreenWidth, ScreenHeight } from '../../shared/utils/dimension/Divices';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment'
import { SPACINGS, FONTSIZES, RADIUS } from '../../themes';
import ImagePicker from 'react-native-image-picker';
import { uploadFileToFireBase } from '../../shared/utils/firebaseStorageUtils';
import { FirebaseService } from '../../api/FirebaseService';

var uuid = require('uuid');
let childTemp = '';
const NewPostScreen = (props) => {
  const { colorsApp } = props.theme;
  const { t } = useTranslation();
  const { userStore } = useStores();
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
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        setIsLoading(true);
        // setSelectedImages([...selectedImages, ...{ uri: response.uri }]);
        Promise.resolve(uploadFileToFireBase(response, userDetail?.id))
          .then((val) => {
            setImages([...images, val])
            setSelectedImages([...selectedImages, val])
            setIsLoading(false);
          })
          .catch((error) => {
            console.log('error.message', error.message);
            ToastHelper.showError(t('error.common'));
            setIsLoading(false);
          });
      }
    });
  };


  const openCamera = () => {
    ImagePicker.launchCamera(IMAGE_CONFIG, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        setIsLoading(true);
        setSelectedImages([...selectedImages, { uri: response.uri }]);
        Promise.resolve(uploadFileToFireBase(response, userDetail?.id))
          .then((val) => {
            setImages([...images, val])
            setSelectedImages([...selectedImages, ...val])
            setIsLoading(false);
          })
          .catch((error) => {
            ToastHelper.showError(t('error.common'));
            setIsLoading(false);
          });
      }
    });
  };
  const isBlog = props?.navigation?.state?.params?.isBlog;

  const createNewPost = () => {
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
    if (images.length > 0) {
      post.images = images;
    }
    if (
      post?.content &&
      post?.content.replace(' ', '') === ''
    ) {
      return;
    }
    childTemp = userDetail?.id + '_' + currentTime;
    try {
      setIsLoading(true);
      FirebaseService.pushNewItemWithChildKey(
        isBlog ? Constant.SCHEMA.BLOG : Constant.SCHEMA.SOCIAL,
        childTemp,
        post,
        false
      ).then(val => {
        setIsLoading(false);
        console.log(val);
        ToastHelper.showSuccess('Success create new post, enjoy! 🚲')
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
          maxLength={2000}
          placeholder="Text your post here 😄"
          onChangeText={(text) => setContent(text)}
          multiline
          numberOfLines={100}
          style={[
            containerStyle.defaultMarginTopSmall,
            containerStyle.textDefaultNormal,
            containerStyle.paddingDefault,
            {
              minHeight: 100,
              maxHeight: ScreenHeight * 0.3,
              width: ScreenWidth * 0.9,
              backgroundColor: '#d0d0d0',
              borderRadius: RADIUS.default,
              marginBottom: 20,
            },
          ]}
        />
      </View>
    );
  };

  const renderImagePicker = () => {
    return (
      <View style={{
        display: "flex", flexDirection: "row",
        width: ScreenWidth * 0.9
      }}>
        <TouchableOpacity
          onPress={() => {
            openImagePicker();
          }}>
          <MaterialIcons name="photo-library" size={40} color={'grey'}></MaterialIcons>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            openCamera();
          }}>
          <MaterialIcons name="camera-alt" size={40} color={'grey'}></MaterialIcons>
        </TouchableOpacity>
      </View>
    );
  };

  const renderItems = ({ item, index }) => (
    <Image style={styles.image} source={{ uri: item.uri }} resizeMode="cover" />
  );

  const renderImageSelected = () => {
    if (selectedImages[0].uri?.includes('PNG') || selectedImages[0].uri?.includes('images') || selectedImages[0].uri?.includes('HEIC') || selectedImages[0].uri?.includes('heic') || selectedImages[0].uri?.includes('JPG') || selectedImages[0].uri?.includes('JPEG') ||
      selectedImages[0].uri?.includes('png') || selectedImages[0].uri?.includes('jpg') || selectedImages[0].uri?.includes('jpeg')) {
      return (
        <FlatList
          numColumns={3}
          style={{ alignSelf: 'center' }}
          data={selectedImages}
          renderItem={(a, index ) => {
            return (
              <Image
                source={{ uri: selectedImages.length > 0 ? a?.item?.uri : Constant.MOCKING_DATA.NO_IMG_PLACE_HOLDER }}
                resizeMode="cover"
                style={selectedImages.length === 1 ? styles.postImages : { width: ScreenWidth * (1 / selectedImages.length), height: ScreenWidth * (1 / selectedImages.length), marginEnd: 10 }}
              />
            )
          }} />
      );
    }
    return (
      <TouchableOpacity style={{ marginBottom: 20 }} onPress={() => { setSelectedImages([]) }}>
        <Video source={{ uri: selectedImages[0].uri }} style={{ width: ScreenWidth / 2, height: ScreenWidth / 2 }} />
      </TouchableOpacity>
    )

  };
  const renderVideo = () => {
    return (
      <TouchableOpacity onPress={() => { setSelectedImages([]) }}>
        <FastImage style={styles.image} source={{ uri: selectedImages[0].uri }} resizeMode="cover" />
      </TouchableOpacity>
    );
  };
  const pickVideo = () => {
    ImagePicker.showImagePicker({
      title: 'Select video',
      mediaType: 'mixed',
      path: 'video',
      quality: 1
    }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        setIsLoading(true);
        setSelectedImages([...selectedImages, { uri: response.uri }]);
        if ((response.uri?.includes('PNG') || response.uri?.includes('JPG') || response.uri?.includes('JPEG') ||
          response.uri?.includes('png') || response.uri?.includes('jpg') || response.uri?.includes('jpeg'))) {
          Promise.resolve(uploadFileToFireBase(response, userDetail?.id))
            .then((val) => {
              setImages([...images, val])
              setIsLoading(false);
            })
            .catch((error) => {
              ToastHelper.showError(t('error.common'));
              setIsLoading(false);
            });

        } else {
          Promise.resolve(uploadFileToFireBase(response, userDetail?.id, '.mov'))
            .then((val) => {
              setImages([...images, val])
              setIsLoading(false);
            })
            .catch((error) => {
              ToastHelper.showError(t('error.common'));
              setIsLoading(false);
            });
        }
      }
    });
  }


  const rightIco = isLoading ? null : (<TextNormal text={t('social.image')}></TextNormal>);

  return (
    <View style={[containerStyle.default]}>
      <StatusBar barStyle={colorsApp.statusBar} />
      <SafeAreaView>
        <HeaderFull title={t('social.createpost')} hasButton rightIco={rightIco} onPress={() => pickVideo()} />
        <ScrollView contentContainerStyle={styles.content}>
          {renderPostInput()}
          {/* {renderImagePicker()} */}
          {selectedImages.length > 0 && renderImageSelected()}
          <GradientButton text="Post" onPress={() => createNewPost()} style={{ marginTop: 20 }} />
        </ScrollView>
      </SafeAreaView>
      {isLoading && <Loading />}
    </View>
  );
}
export default withTheme(NewPostScreen);
