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
import { firebase } from '@react-native-firebase/messaging';
import { ScrollView } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import QRCode from 'react-native-qrcode-svg';
import Fontisto from 'react-native-vector-icons/Fontisto';
import ImagePicker from 'react-native-image-picker';
import { uploadFileToFireBase } from '../../shared/utils/firebaseStorageUtils/index';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FastImage from 'react-native-fast-image';
import GradientButton from '../../shared/components/Buttons/GradientButton';
import { ScreenWidth, ScreenHeight } from '../../shared/utils/dimension/Divices';
import { NavigationService } from '../../navigation';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { ScreenNames } from '../../route/ScreenNames';
import LottieView from 'lottie-react-native';
import AxiosFetcher from '../../api/AxiosFetch';
import HeaderFull from '../../shared/components/Header/HeaderFull';
import IALocalStorage from '../../shared/utils/storage/IALocalStorage';
import { ToastHelper } from '../../shared/components/ToastHelper';
import Constant from '../../shared/utils/constant/Constant';
import { useObserver } from 'mobx-react';
import Loading from '../../shared/components/Loading';
import ModalAccount from '../../shared/components/Modal/ModalAccount';

const ProfileScreen = (props) => {
  const { colorsApp } = props.theme;
  const { t } = useTranslation();
  const { userStore } = useStores();
  const [isLoading, setIsLoading] = useState(false);
  const [avt, setAvt] = useState('');
  const [di, setDi] = useState(-1);
  const [modelSelect, setModalSelect] = useState('');
  const [qr, setQR] = useState(undefined);
  const [showModal, setShowModal] = useState(false);

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
  const renderItem = (ico, title, rightTitle, onPress, hasMoreDesc, desc) => {
    return (
      <View>
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={onPress
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
              text={di === title ? "🌟🌟🌟🌟🌟🌟🌟" : rightTitle}
              style={[
                containerStyle.textContent,
                containerStyle.defaultTextMarginEnd,
              ]}
            />
            <SimpleLineIcons name="arrow-right" size={20} />
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
            avatar: userStore?.userInfo?.avatar,
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
        Promise.resolve(uploadFileToFireBase(response, userStore?.userInfo?.id))
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
    const fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      console.log('Token FCM: ' + fcmToken);
      AxiosFetcher({
        method: 'POST',
        url: 'user/' + userStore?.userInfo?.id + '/fcmtoken',
        data: '_',
        hasToken: true,
      })
        .then(async (val) => {
        })
        .catch(() => {

        });
    }
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
            openPicker();
          }}>
          <FastImage
            source={{
              uri:
                userStore?.userInfo?.avatar ||
                Constant.MOCKING_DATA.NO_IMG_PLACE_HOLDER,
            }}
            resizeMode="cover"
            style={styles.avatar}
          />
        </TouchableOpacity>

        <TextNormal
          text={userStore?.userInfo?.name || ''}
          style={[
            containerStyle.textHeaderSmall,
            containerStyle.defaultMarginTop,
          ]}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignContent: 'center', alignItems: 'center', alignSelf: 'center', }}>
            <View style={{ width: 60, height: 40 }}>
              <LottieView
                autoPlay
                loop={false}
                style={{ width: 60, height: 40 }}
                source={require('../../../assets/imgs/wallet.json')}
              />
            </View>
            <TextNormal
              text={`0 🏵 (${userStore?.userInfo?.currency})`}
              style={[
                containerStyle.textContentSmall,
                { marginLeft: -10, color: 'grey' }
              ]}
            />
          </View>
          <TextNormal text="  🦯   " />
          <TouchableOpacity onPress={() => {
            const data = `${userStore?.userInfo?.id}_${userStore?.userInfo?.name}_${userStore?.userInfo?.phoneNumber}`;
            setQR(data);
          }}>
            <FontAwesome name="qrcode" size={20} color={colors.blackInput} />
          </TouchableOpacity>
        </View>
        <View style={containerStyle.defaultMarginTopSmall}>
          {renderItem(
            <MaterialCommunityIcons
              name="star-face"
              size={25}
              color={colors.black_clear_all}
            />,
            t('account.name'),
            userStore?.userInfo?.name || '',
            () => {
              if (di !== t('account.name')) {
                setDi(t('account.name'));
              } else {
                setDi(-1);
              }
            },
          )}
          {renderItem(
            <MaterialCommunityIcons
              name="cake"
              size={25}
              color={colors.black_clear_all}
            />,
            t('account.dob'),
            userStore?.userInfo?.dateOfBirth || '',
            () => {
              if (di !== t('account.dob')) {
                setDi(t('account.dob'));
              } else {
                setDi(-1);
              }
            },
          )}
          {renderItem(
            <MaterialCommunityIcons
              name="card-account-phone-outline"
              size={25}
              color={colors.black_clear_all}
            />,
            t('account.phone'),
            userStore?.userInfo?.phoneNumber,
            () => {
              if (di !== t('account.phone')) {
                setDi(t('account.phone'));
              } else {
                setDi(-1);
              }
            },
          )}
          {renderItem(
            <MaterialCommunityIcons
              name="email-box"
              size={25}
              color={colors.black_clear_all}
            />,
            t('account.email'),
            userStore?.userInfo?.email,
            () => {
              if (di !== t('account.email')) {
                setDi(t('account.email'),);
              } else {
                setDi(-1);
              }
            },
          )}
          {renderItem(
            <MaterialCommunityIcons
              name="gender-transgender"
              size={25}
              color={colors.black_clear_all}
            />,
            t('account.sex'),
            userStore?.userInfo?.gender,
            () => {
              if (di !== t('account.sex')) {
                setDi(t('account.sex'),);
              } else {
                setDi(-1);
              }
            },
          )}
          {renderItem(
            <Ionicons
              name="ios-location-outline"
              size={25}
              color={colors.black_clear_all}
            />,
            t('account.address'),
            userStore?.userInfo?.address,
            () => {
              if (di !== t('account.address')) {
                setDi(t('account.address'));
              } else {
                setDi(-1);
              }
            },
          )}
          {renderItem(
            <Ionicons
              name="md-globe-outline"
              size={25}
              color={colors.black_clear_all}
            />,
            t('account.language'),
            userStore?.userInfo?.language,
            () => {
              if (di !== t('account.language')) {
                setDi(t('account.language'));
              } else {
                setDi(-1);
              }
            },
          )}
          {renderItem(
            <Fontisto
              name="money-symbol"
              size={25}
              color={colors.black_clear_all}
            />,
            t('account.currentcy'),
            userStore?.userInfo?.currency || 'VND',
            () => {
              if (di !== t('account.currentcy')) {
                setDi(t('account.currentcy'));
              } else {
                setDi(-1);
              }
            },
          )}
          {renderItem(
            <SimpleLineIcons
              name="emotsmile"
              size={25}
              color={colors.black_clear_all}
            />,
            t('account.about'),
            '',
            () => {
              if (di !== t('account.about')) {
                setDi(t('account.about'));
              } else {
                setDi(-1);
              }
            },
            true,
            userStore?.userInfo?.aboutMe,
          )}
          {renderItem(
            <Ionicons
              name="md-notifications-circle-outline"
              size={25}
              color={colors.black_clear_all}
            />,
            t('account.notification'),
            userStore?.userInfo?.notification || 'Off',
            () => {
              if (di !== t('account.notification')) {
                setDi(t('account.notification'));
              } else {
                setDi(-1);
              }
            },
          )}
          {renderItem(
            <MaterialCommunityIcons
              name="logout"
              size={25}
              color={colors.black_clear_all}
            />,
            t('account.logout'),
            '',
            async () => {
              setModalSelect('LOGOUT');
              setShowModal(true);
            },
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
          onPress={() => NavigationService.navigate(ScreenNames.Update)}
          rightIco={
            <Ionicons name="pencil" size={20} color={colors.blackInput} />
          }

        />
        <ScrollView nestedScrollEnabled contentContainerStyle={styles.content}>
          {renderMe()}
        </ScrollView>
        <TouchableOpacity style={{ position: 'absolute', left: 20, top: 40 }} onPress={()=>{
          NavigationService.navigate(ScreenNames.Account, { data: userStore?.userInfo, isOnlyImg: true }) ;
        }}>
          <Ionicons name="bulb-outline" size={20} color={colors.red} size={25}/>
        </TouchableOpacity>
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
      {qr && qr !== "" && qr && <TouchableOpacity onPress={() => { setQR(false) }} style={{ borderRadius: 2, borderColor: 'white', borderWidth: 3, position: 'absolute', justifyContent: 'center', top: ScreenHeight / 3, left: ScreenWidth / 4, zIndex: 100, alignContent: 'center', alignItems: 'center' }}>
        <QRCode value={`${qr || 'das'}`} size={200} />
      </TouchableOpacity>}
    </View>
  ));
};

export default withTheme(ProfileScreen);
