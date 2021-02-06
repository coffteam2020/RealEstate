import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  TextInput,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  View,
  Image,
  FlatList,
  Text
} from 'react-native';
import { withTheme } from 'react-native-paper';
import { NavigationService } from '../../navigation';
import { useStores } from '../../store/useStore';
import { containerStyle } from '../../themes/styles';
import GradientButton from '../../shared/components/Buttons/GradientButton'
import { styles } from './style';
import AxiosFetcher from '../../api/AxiosFetch';
import IALocalStorage from '../../shared/utils/storage/IALocalStorage';
import Loading from '../../shared/components/Loading';
import { ToastHelper } from '../../shared/components/ToastHelper';
import Constant from '../../shared/utils/constant/Constant';
import Video from 'react-native-video';
import HeaderFull from '../../shared/components/Header/HeaderFull';
import { ScreenWidth, ScreenHeight } from '../../shared/utils/dimension/Divices';
import moment from 'moment'
import { RADIUS } from '../../themes';
import ImagePicker, { launchImageLibrary } from 'react-native-image-picker';
import { uploadFileToFireBase } from '../../shared/utils/firebaseStorageUtils';
import { FirebaseService } from '../../api/FirebaseService';
import IconAntDesign from 'react-native-vector-icons/AntDesign';

var uuid = require('uuid');
let childTemp = '';
const NewPostScreen = (props) => {
  const { colorsApp } = props.theme;
  const { t } = useTranslation();
  const { userStore } = useStores();
  const [userDetail, setUserDetail] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [images, setImages] = useState([]);
  const [isVisible, setIsvisible] = useState(false);
  console.log('selectedImages', selectedImages)

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
    if (images.length > 0) { post.images = images }
    if (post?.content && post?.content.replace(' ', '') === '') { return }
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
              textAlignVertical: 'top'
            },
          ]}
        />
        <TouchableOpacity onPress={() => setIsvisible(true)} style={styles.btnAttach}>
          <IconAntDesign name="pluscircleo" color="#fff" size={20} style={styles.iconPlus} />
          <Text style={styles.txtBtnAttach}>{t('social.image')}</Text>
        </TouchableOpacity>
        {isVisible && <View style={styles.groupButtonChoose}>
          <TouchableOpacity onPress={() => onPhotoMediaType()} style={styles.btnChooseVideo}>
            <Text style={styles.txtBtnChooseVideo}>Choose a photo...</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onVideoMediaType()} style={styles.btnChooseVideo}>
            <Text style={styles.txtBtnChooseVideo}>Choose a video...</Text>
          </TouchableOpacity>
        </View>}
      </View>
    );
  };

  const onVideoMediaType = () => { pickVideo('video') };

  const onPhotoMediaType = () => { pickVideo('image') };

  const renderImageSelected = () => {
    if (selectedImages[0].uri?.includes('PNG') || selectedImages[0].uri?.includes('images') || selectedImages[0].uri?.includes('HEIC') || selectedImages[0].uri?.includes('heic') || selectedImages[0].uri?.includes('JPG') || selectedImages[0].uri?.includes('JPEG') ||
      selectedImages[0].uri?.includes('png') || selectedImages[0].uri?.includes('jpg') || selectedImages[0].uri?.includes('jpeg')) {
      return (
        <FlatList
          numColumns={3}
          style={{ alignSelf: 'center' }}
          data={selectedImages}
          renderItem={(a, index) => {
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

    // <>
    //   {selectedImages[0].uri?.includes('video') &&
    //     <Video source={{ uri: selectedImages[0].uri }} style={{ width: ScreenWidth / 2, height: ScreenWidth / 2, marginVertical: 20 }} />
    //   }
    //   {selectedImages[0].uri?.includes('images') &&
    //     <FlatList
    //       numColumns={3}
    //       contentContainerStyle={{ alignSelf: 'center' }}
    //       data={selectedImages}
    //       renderItem={(a, index) => {
    //         return (
    //           <Image
    //             source={{ uri: a?.item?.uri }}
    //             resizeMode="cover"
    //             style={selectedImages.length === 1 ? styles.postImages : { width: ScreenWidth * (1 / selectedImages.length), height: ScreenWidth * (1 / selectedImages.length), marginEnd: 10 }}
    //           />
    //         )
    //       }}
    //     />
    //   }
    // </>
  };

  const pickVideo = (mediaType) => {
    // if (mediaType === 'image') {
    launchImageLibrary({
      title: 'Select video',
      mediaType: mediaType,
      quality: 1
    }, (response) => {
      console.log('response: =====', response)
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
              console.log('check val 1', val)
              setTimeout(async () => {
                await setImages([...images, val])
              }, 3000)
              setIsLoading(false);
            })
            .catch((error) => {
              ToastHelper.showError(t('error.common'));
              setIsLoading(false);
            });

        } else {
          Promise.resolve(uploadFileToFireBase(response, userDetail?.id, '.mov'))
            .then((val) => {
              console.log('check val 2', val)
              setTimeout(async () => {
                await setImages([...images, val])
              }, 5000)
              setIsLoading(false);
            })
            .catch((error) => {
              ToastHelper.showError(t('error.common'));
              setIsLoading(false);
            });
        }
        setIsLoading(false);
      }
    })
    // }
    // else {

    // }
  }

  return (
    <View style={[containerStyle.default]}>
      <StatusBar barStyle={colorsApp.statusBar} />
      <SafeAreaView>
        <HeaderFull title={t('social.createpost')} hasButton={true} />
        <ScrollView contentContainerStyle={styles.content}>
          {renderPostInput()}
          {selectedImages.length > 0 && renderImageSelected()}
          <GradientButton text="Post" onPress={() => createNewPost()} style={{ marginTop: 20 }} disable={(content == '' && selectedImages.length == 0) || isLoading == true} />
        </ScrollView>
      </SafeAreaView>
      {isLoading && <Loading />}
    </View>
  );
}
export default withTheme(NewPostScreen);
