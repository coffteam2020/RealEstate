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
import TextInputFlatLeftIconTouchable from '../../shared/components/TextInput/TextInputFlatLeftIconTouchable';
import TextInputFlat from '../../shared/components/TextInput/TextInputFlat';

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
const Update = (props) => {
  const {colorsApp} = props.theme;
  const {t} = useTranslation();
  const {userStore} = useStores();
  const [text, setText] = useState('');
  useEffect(() => {
    getProfile();
  }, []);
  const getProfile = async () => {
    let userInfo = await IALocalStorage.getDetailUserInfo();
    AxiosFetcher({
      method: 'GET',
      url: 'user/' + userInfo?.id,
      hasToken: true,
    })
      .then((val) => {
        userStore.userInfo = val;
      })
      .catch(() => {
        ToastHelper.showError(t('account.getInfoErr'));
      });
  };

  const renderMe = () => {
    return (
      <View style={[containerStyle.center, containerStyle.shadow]}>
        <TextInputFlat
          keyboardType="default"
          props={props}
          onChangeText={(text) => {
            // setTo(text || '');
            // setEnableTo(text !== '');
          }}
          text={t('account.name')}
          placeholder={userStore?.userInfo?.name || ''}
          textInputStyle={[
            styles.fieldEmailPhone,
            containerStyle.defaultMarginBottom,
          ]}
        />
         <TextInputFlat
          keyboardType="default"
          props={props}
          onChangeText={(text) => {
            // setTo(text || '');
            // setEnableTo(text !== '');
          }}
          text={t('account.dob')}
          placeholder={userStore?.userInfo?.dateOfBirth || ''}
          textInputStyle={[
            styles.fieldEmailPhone,
            containerStyle.defaultMarginBottom,
          ]}
        />
         <TextInputFlat
          keyboardType="default"
          props={props}
          onChangeText={(text) => {
            // setTo(text || '');
            // setEnableTo(text !== '');
          }}
          text={t('account.phone')}
          placeholder={`${userStore?.userInfo?.phoneNumber}` || ''}
          textInputStyle={[
            styles.fieldEmailPhone,
            containerStyle.defaultMarginBottom,
          ]}
        />
         <TextInputFlat
          keyboardType="default"
          props={props}
          onChangeText={(text) => {
            // setTo(text || '');
            // setEnableTo(text !== '');
          }}
          text={t('account.email')}
          placeholder={userStore?.userInfo?.name || ''}
          textInputStyle={[
            styles.fieldEmailPhone,
            containerStyle.defaultMarginBottom,
          ]}
        />
         <TextInputFlat
          keyboardType="default"
          props={props}
          onChangeText={(text) => {
            // setTo(text || '');
            // setEnableTo(text !== '');
          }}
          text={t('account.sex')}
          placeholder={userStore?.userInfo?.name || ''}
          textInputStyle={[
            styles.fieldEmailPhone,
            containerStyle.defaultMarginBottom,
          ]}
        />
         <TextInputFlat
          keyboardType="default"
          props={props}
          onChangeText={(text) => {
            // setTo(text || '');
            // setEnableTo(text !== '');
          }}
          text={t('account.address')}
          placeholder={userStore?.userInfo?.name || ''}
          textInputStyle={[
            styles.fieldEmailPhone,
            containerStyle.defaultMarginBottom,
          ]}
        />
         <TextInputFlat
          keyboardType="default"
          props={props}
          onChangeText={(text) => {
            // setTo(text || '');
            // setEnableTo(text !== '');
          }}
          text={t('account.currentcy')}
          placeholder={userStore?.userInfo?.name || ''}
          textInputStyle={[
            styles.fieldEmailPhone,
            containerStyle.defaultMarginBottom,
          ]}
        />
         <TextInputFlat
          keyboardType="default"
          props={props}
          onChangeText={(text) => {
            // setTo(text || '');
            // setEnableTo(text !== '');
          }}
          text={t('account.about')}
          placeholder={userStore?.userInfo?.name || ''}
          textInputStyle={[
            styles.fieldEmailPhone,
            containerStyle.defaultMarginBottom,
          ]}
        />
        <GradientButton
          fromColor={colors.purpleMain}
          toColor={colors.purpleMain}
          text={t('location.submit')}
          style={[containerStyle.defaultMarginTop]}
          onPress={() => {
            ToastHelper.showWarning(
              'This feature is in progress working. Wait for next version',
            );
          }}
        />
        <GradientButton
          fromColor={colors.red}
          toColor={colors.red}
          text={t('common.cancel')}
          style={[containerStyle.defaultMarginTop]}
          onPress={() => {
            NavigationService.goBack();
          }}
        />
      </View>
    );
  };
  return useObserver(() => (
    <View
      style={[
        containerStyle.default,
        containerStyle.defaultBackground,
        {paddingTop: 20},
      ]}>
      <StatusBar barStyle={colorsApp.statusBar} />
      <SafeAreaView>
        <HeaderFull title={t('account.update')} />
        <ScrollView nestedScrollEnabled contentContainerStyle={styles.content}>
          {renderMe()}
        </ScrollView>
      </SafeAreaView>
    </View>
  ));
};

export default withTheme(Update);
