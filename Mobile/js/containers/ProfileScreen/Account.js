/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { StatusBar, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { styles } from './style';
import { images } from '../../../assets/index';
import { withTheme } from 'react-native-paper';
import TextNormal from '../../shared/components/Text/TextNormal';
import { containerStyle } from '../../themes/styles';
import { useTranslation } from 'react-i18next';
import { useStores } from '../../store/useStore';
import { colors } from '../../shared/utils/colors/colors';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import ImagePicker from 'react-native-image-picker';
import { uploadFileToFireBase } from '../../shared/utils/firebaseStorageUtils/index';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FastImage from 'react-native-fast-image';
import GradientButton from '../../shared/components/Buttons/GradientButton';
import { ScreenWidth, ScreenHeight } from '../../shared/utils/dimension/Divices';
import { NavigationService } from '../../navigation';
import { ScreenNames } from '../../route/ScreenNames';
import Video from 'react-native-video';
import AxiosFetcher from '../../api/AxiosFetch';
import { firebase } from '@react-native-firebase/messaging';
import HeaderFull from '../../shared/components/Header/HeaderFull';
import IALocalStorage from '../../shared/utils/storage/IALocalStorage';
import { ToastHelper } from '../../shared/components/ToastHelper';
import Constant from '../../shared/utils/constant/Constant';
import { useObserver } from 'mobx-react';
import Loading from '../../shared/components/Loading';
import ModalAccount from '../../shared/components/Modal/ModalAccount';
import { SPACINGS } from '../../themes';

const Account = (props) => {
  const { colorsApp } = props.theme;
  const a = props.navigation.state.params?.data;
  //   console.log(JSON.stringify(data));
  const { t } = useTranslation();
  const { userStore } = useStores();
  const [isLoading, setIsLoading] = useState(false);
  const [avt, setAvt] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [modelSelect, setModalSelect] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [allPost, setAllPost] = useState([]);
  const [data, setData] = useState(a);

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
      getMessages();
    });
    getProfile();
    getMessages();
  }, []);
  const getMessages = async () => {
    let user = await IALocalStorage.getDetailUserInfo();
    setIsLoading(true);
    await firebase
      .database()
      .ref(Constant.SCHEMA.SOCIAL)
      .once('value', (snapshot) => {
        const data = snapshot.val() ? Object.values(snapshot.val()) : [];
        let arr = data.sort(function (x, y) {
          return y.timeInMillosecond - x.timeInMillosecond;
        });
        console.log(JSON.stringify(arr));
        console.log(a?.userId);
        arr = arr?.filter(a => a?.userId === a?.userId && a?.images?.length > 0);
        setAllPost(arr)
        console.log(arr.length);
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      });
  };

  const renderPost = (item) => {
    return (
      <TouchableOpacity
        onPress={() => {
          NavigationService.navigate(ScreenNames.PostDetailScreen, {
            data: { ...item },
          });
        }}
        style={[
          {
            paddingTop: SPACINGS.large,
          },
        ]}>
        <View style={styles.postContainer}>
          <View style={styles.postContent}>
            <View style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
              {item?.images && (item?.images[0]?.includes('PNG') || item?.images[0]?.includes('JPG') || item?.images[0]?.includes('JPEG') ||
                item?.images[0]?.includes('png') || item?.images[0]?.includes('jpg') || item?.images[0]?.includes('jpeg')) ?
                <FastImage
                  source={{
                    uri:
                      item?.images[0] ||
                      Constant.MOCKING_DATA.NO_IMG_PLACE_HOLDER,
                  }}
                  resizeMode="cover"
                  style={styles.postImages}
                /> :
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: 'center',
                    width: ScreenWidth / 2 - 20, 
                    height: ScreenWidth / 2 - 20, 
                    marginLeft: 15
                  }}>
                  <Video
                    paused={true}
                    playWhenInactive={false}
                    playInBackground={false}
                    controls={true}
                    source={{ uri: item?.images?.[0] }}
                    style={{ width: ScreenWidth / 2 - 20, height: ScreenWidth / 2 - 20, marginLeft: 15 }}
                  />
                </View>
              }
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  const renderAllPost = () => {
    return (
      <View>
        <TextNormal text={t('chat.attachment')} style={{ marginLeft: 10, marginTop: 20 }} />

        <FlatList
          data={allPost}
          scrollEnabled
          numColumns={2}
          style={{
            width: ScreenWidth,
            height: '100%',
            marginTop: 10,
          }}
          onRefresh={() => {
            setIsFetching(true);
            getAllPost();
          }}
          refreshing={isFetching}
          keyExtractor={(item) => item._id}
          renderItem={({ item, index }) => {

            return renderPost(item);
          }}
        />
      </View>
    );
  };
  const getProfile = async () => {
    let userInfo = await IALocalStorage.getDetailUserInfo();
    setIsLoading(true);
    AxiosFetcher({
      method: 'GET',
      url: 'user/' + data?.userId,
      hasToken: true,
    })
      .then((val) => {
        if (val?.data !== '') {
          setIsLoading(false);
          setData(val);
          //   userStore.userInfo = val;
          //   setAvt(val?.avatar);
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
  const renderItem = (ico, title, rightTitle, onPress, hasMoreDesc, desc) => {
    return (
      <View>
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={
            onPress
              ? onPress
              : () => {
                NavigationService.navigate(ScreenNames.Update, {
                  key: title,
                  value: title?.toLowerCase(),
                  item: hasMoreDesc ? desc : rightTitle,
                });
              }
          }>
          <View style={styles.nestedContainer}>
            {ico}
            <View>
              <TextNormal
                text={title}
                style={[
                  containerStyle.textDefaultContent,
                  containerStyle.defaultTextMarginLeft,
                ]}
              />
              {hasMoreDesc && desc ? (
                <TextNormal
                  text={desc}
                  style={[
                    containerStyle.textDefaultContent,
                    containerStyle.defaultTextMarginLeft,
                  ]}
                />
              ) : null}
            </View>
          </View>
          <View style={styles.nestedContainer}>
            <TextNormal
              text={rightTitle}
              style={[
                containerStyle.textContent,
                containerStyle.defaultTextMarginEnd,
              ]}
            />
            {/* <SimpleLineIcons name="arrow-right" size={20} /> */}
          </View>
        </TouchableOpacity>
        <View style={styles.line} />
      </View>
    );
  };
  const updateProfilePicture = async (url) => {
    let user = await IALocalStorage.getDetailUserInfo();
    AxiosFetcher({
      method: 'POST',
      url: `user/${user?.id}/update`,
      data: {
        ...user?.userInfo,
        avatar: url || '',
        id: user?.id,
      },
      hasToken: true,
    })
      .then((val) => {
        //
        console.log(JSON.stringify(val));
        if (val?.avatar) {
        } else {
          ToastHelper.showError(t('error.common'));
          userStore.userInfo = {
            ...userStore?.userInfo,
            avatar: data?.avatar,
          };
        }
      })
      .catch(() => {
        ToastHelper.showError(t('error.common'));
        userStore.userInfo = {
          ...userStore?.userInfo,
          avatar: avt,
        };
      });
  };
  const openPicker = async () => {
    ImagePicker.showImagePicker(IMAGE_CONFIG, (response) => {
      // console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };
        userStore.userInfo = { ...userStore?.userInfo, avatar: source?.uri };
        setIsLoading(true);
        Promise.resolve(uploadFileToFireBase(response, data?.id))
          .then(async (val) => {
            await updateProfilePicture(val);
            setIsLoading(false);
          })
          .catch((error) => {
            ToastHelper.showError(t('error.common'));
            setIsLoading(false);
          });
      }
    });
  };
  const logout = async () => {
    await IALocalStorage.resetLocalStorage();
    NavigationService.navigate(ScreenNames.LoginScreen);
  }
  const closeDialog = () => {
    setModalSelect(null);
    setShowModal(true);
  }


  const renderMe = () => {
    return (
      <View style={[containerStyle.center, containerStyle.shadow]}>
        <TouchableOpacity
          onPress={() => {
            // openPicker();
          }}>
          <FastImage
            source={{
              uri:
                data?.avatar ||
                Constant.MOCKING_DATA.NO_IMG_PLACE_HOLDER,
            }}
            resizeMode="cover"
            style={styles.avatar}
          />
        </TouchableOpacity>
        <TextNormal
          text={data?.name || ''}
          style={[
            containerStyle.textHeaderSmall,
            containerStyle.defaultMarginTop,
          ]}
        />
        <View style={containerStyle.defaultMarginTopSmall}>
          {renderItem(
            <MaterialCommunityIcons
              name="star-face"
              size={25}
              color={colors.black_clear_all}
            />,
            t('account.name'),
            data?.name || '',
            () => { },
          )}
          {renderItem(
            <MaterialCommunityIcons
              name="cake"
              size={25}
              color={colors.black_clear_all}
            />,
            t('account.dob'),
            '🌟🌟🌟',
            () => { },
          )}
          {renderItem(
            <MaterialCommunityIcons
              name="card-account-phone-outline"
              size={25}
              color={colors.black_clear_all}
            />,
            t('account.phone'),
            '🌟🌟🌟',
            () => { },
          )}
          {renderItem(
            <MaterialCommunityIcons
              name="email-box"
              size={25}
              color={colors.black_clear_all}
            />,
            t('account.email'),
            '🌟🌟🌟',
            () => { },
          )}
          {renderItem(
            <MaterialCommunityIcons
              name="gender-transgender"
              size={25}
              color={colors.black_clear_all}
            />,
            t('account.sex'),
            '🌟🌟🌟',
            () => { },
          )}
          {renderItem(
            <Ionicons
              name="ios-location-outline"
              size={25}
              color={colors.black_clear_all}
            />,
            t('account.address'),
            '🌟🌟🌟',
            () => { },
          )}
          {renderItem(
            <Ionicons
              name="md-globe-outline"
              size={25}
              color={colors.black_clear_all}
            />,
            t('account.language'),
            data?.language,
            () => { },
          )}
        </View>
      </View>
    );
  };
  return useObserver(() => (
    <View style={[containerStyle.default, containerStyle.defaultBackground]}>
      <StatusBar barStyle={colorsApp.statusBar} />
      <SafeAreaView>
        <HeaderFull
          title={t('account.title')}
          hasButton
        />
        <ScrollView nestedScrollEnabled contentContainerStyle={styles.content}>
          {renderMe()}

          {renderAllPost()}
        </ScrollView>
      </SafeAreaView>
      {isLoading && <Loading />}
      {modelSelect ? (
        <ModalAccount
          isVisible={showModal}
          title={modelSelect}
          onPress={() => {
            logout();
          }}
          onClose={() => closeDialog()}
        />
      ) : null}
    </View>
  ));
};

export default withTheme(Account);
