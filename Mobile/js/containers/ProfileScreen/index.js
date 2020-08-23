/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {StatusBar, View, SafeAreaView, TouchableOpacity} from 'react-native';
import {styles} from './style';
import {images} from '../../../assets/index';
import {withTheme} from 'react-native-paper';
import TextNormal from '../../shared/components/Text/TextNormal';
import {containerStyle} from '../../themes/styles';
import {useTranslation} from 'react-i18next';
import {useStores} from '../../store/useStore';
import {colors} from '../../shared/utils/colors/colors';
import {ScrollView} from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import ImagePicker from 'react-native-image-picker';
import {uploadFileToFireBase} from '../../shared/utils/firebaseStorageUtils/index';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FastImage from 'react-native-fast-image';
import GradientButton from '../../shared/components/Buttons/GradientButton';
import {ScreenWidth, ScreenHeight} from '../../shared/utils/dimension/Divices';
import {NavigationService} from '../../navigation';
import {ScreenNames} from '../../route/ScreenNames';
import AxiosFetcher from '../../api/AxiosFetch';
import HeaderFull from '../../shared/components/Header/HeaderFull';
import IALocalStorage from '../../shared/utils/storage/IALocalStorage';
import {ToastHelper} from '../../shared/components/ToastHelper';
import Constant from '../../shared/utils/constant/Constant';
import {useObserver} from 'mobx-react';
import Loading from '../../shared/components/Loading';

const MOCK = [
  {
    id: 0,
    firstName: 'Mayuko',
    lastName: 'Nashel',
    avatar: 'https://i1.sndcdn.com/avatars-000143568666-ksxxz6-t500x500.jpg',
    gender: 0,
    searchLocation: 'Binh Thanh, Ho Chi Minh',
    genderLookingFor: 'Female',
    note:
      'I want to make a openable chances for everyone wanna deal with my property. Home is da best',
  },
  {
    id: 1,
    firstName: 'Tech',
    lastName: 'Lead',
    searchLocation: 'Phuong 10, Go Vap, Ho Chi Minh',
    avatar:
      'https://image.cnbcfm.com/api/v1/image/106139275-1568921126945facebookyt.jpg?v=1568922003&w=1600&h=900',
    gender: 1,
    genderLookingFor: 'Male',
    note:
      'Ex-Google tech lead Patrick Shyu explains how to learn to buy property quickly and easily, with this one weird trick! It`s so simple with this 1-step! Are you looking ? ...',
  },
  {
    id: 2,
    firstName: 'Ura',
    lastName: 'Mickey',
    genderLookingFor: 'Male',
    searchLocation: 'Phuong 13, Nhat Chi Mai, Tan Binh, Ho Chi Minh',
    avatar:
      'https://i1.wp.com/innovation-village.com/wp-content/uploads/2020/05/Twitter-CEO-Jack-Dorsey-pledges-over-a-quarter-of-his-780x470-1.jpg?fit=780%2C470&ssl=1',
    gender: 1,
    note:
      'Jack Patrick Dorsey is an American technology entrepreneur and philanthropist who is the co-founder and CEO of Twitter, and the founder and CEO of Square, a financial payments company.',
  },
];
const ProfileScreen = (props) => {
  const {colorsApp} = props.theme;
  const {t} = useTranslation();
  const {userStore} = useStores();
  const [isLoading, setIsLoading] = useState(false);
  const [avt, setAvt] = useState('');
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
        const source = {uri: response.uri};
        userStore.userInfo = {...userStore?.userInfo, avatar: source?.uri};
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
        <View style={containerStyle.defaultMarginTopSmall}>
          {renderItem(
            <MaterialCommunityIcons
              name="star-face"
              size={25}
              color={colors.black_clear_all}
            />,
            t('account.name'),
            userStore?.userInfo?.name || '',
            () => {},
          )}
          {renderItem(
            <MaterialCommunityIcons
              name="cake"
              size={25}
              color={colors.black_clear_all}
            />,
            t('account.dob'),
            userStore?.userInfo?.dateOfBirth || '',
            () => {},
          )}
          {renderItem(
            <MaterialCommunityIcons
              name="card-account-phone-outline"
              size={25}
              color={colors.black_clear_all}
            />,
            t('account.phone'),
            userStore?.userInfo?.phoneNumber,
            () => {},
          )}
          {renderItem(
            <MaterialCommunityIcons
              name="email-box"
              size={25}
              color={colors.black_clear_all}
            />,
            t('account.email'),
            userStore?.userInfo?.email,
            () => {},
          )}
          {renderItem(
            <MaterialCommunityIcons
              name="gender-transgender"
              size={25}
              color={colors.black_clear_all}
            />,
            t('account.sex'),
            userStore?.userInfo?.gender,
            () => {},
          )}
          {renderItem(
            <Ionicons
              name="ios-location-outline"
              size={25}
              color={colors.black_clear_all}
            />,
            t('account.address'),
            userStore?.userInfo?.address,
            () => {},
          )}
          {renderItem(
            <Ionicons
              name="md-globe-outline"
              size={25}
              color={colors.black_clear_all}
            />,
            t('account.language'),
            userStore?.userInfo?.language,
            () => {},
          )}
          {renderItem(
            <Fontisto
              name="money-symbol"
              size={25}
              color={colors.black_clear_all}
            />,
            t('account.currentcy'),
            userStore?.userInfo?.currency || 'VND',
            () => {},
          )}
          {renderItem(
            <SimpleLineIcons
              name="emotsmile"
              size={25}
              color={colors.black_clear_all}
            />,
            t('account.about'),
            '',
            () => {},
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
            () => {},
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
              await IALocalStorage.resetLocalStorage();
              NavigationService.navigate(ScreenNames.LoginScreen);
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
      </SafeAreaView>
      {isLoading && <Loading />}
    </View>
  ));
};

export default withTheme(ProfileScreen);
