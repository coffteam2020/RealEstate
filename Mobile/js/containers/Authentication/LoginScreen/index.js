/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {StatusBar, View, TouchableOpacity, ImageBackground} from 'react-native';
import {styles} from './style';
import {images} from '../../../../assets/index';
import {withTheme} from 'react-native-paper';
import TextNormal from '../../../shared/components/Text/TextNormal';
import {containerStyle} from '../../../themes/styles';
import {useTranslation} from 'react-i18next';
import TextInputFlat from '../../../shared/components/TextInput/TextInputFlat';
import Eye from '../../../shared/components/Icons/Eye';
import {colors} from '../../../shared/utils/colors/colors';
import GradientButton from '../../../shared/components/Buttons/GradientButton';
import * as Animatable from 'react-native-animatable';
import Route, {ScreenNames} from '../../../route/ScreenNames';
import {NavigationService} from '../../../navigation';
import {ToastHelper} from '../../../shared/components/ToastHelper';
import Validator from '../../../shared/utils/validator/Validator';
import Loading from '../../../shared/components/Loading';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useStores} from '../../../store/useStore';
import AxiosFetcher from '../../../api/AxiosFetch';
import IALocalStorage from '../../../shared/utils/storage/IALocalStorage';

const LoginScreen = (props) => {
  const {colorsApp} = props.theme;
  const {t} = useTranslation();
  const [password] = useState('');
  const [email] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [notEmptyPass] = useState(false);
  const [showPass, setShowPass] = useState(true);
  const [userInfo, setUserInfo] = useState({});

  const onLogin = async () => {
    if (Validator.checkEmptyField(userInfo?.phone || '')) {
      ToastHelper.showError(t('error.empty'));
      return;
    }
    if (Validator.checkEmptyField(userInfo?.password || '')) {
      ToastHelper.showError(t('error.empty'));
      return;
    }
    if (!userInfo?.password || !userInfo?.phone) {
      ToastHelper.showError(t('error.empty'));
      return;
    }
    // Login flow
    setIsLoading(true);
    AxiosFetcher({
      method: 'POST',
      url: 'auth/login',
      data: {
        loginMethod: 'NORMAL',
        password: userInfo?.password,
        phoneNumber: userInfo?.phone,
      },
    })
      .then(async (data) => {
        if (data?.accessToken) {
          ToastHelper.showSuccess(t('login.signInSuccess'));
          await IALocalStorage.setTokenUserInfo(data?.accessToken);
          await IALocalStorage.setDetailUserInfo(data);
          setTimeout(() => {
            NavigationService.navigate(ScreenNames.TabsScreen);
          }, 1000);
        } else {
          ToastHelper.showError(t('login.error'));
        }
      })
      .catch(() => {
        ToastHelper.showError(t('login.error'));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <View style={[containerStyle.default]}>
      <StatusBar barStyle={colorsApp.statusBar} />
      <ImageBackground
        source={images.bg_main}
        style={{width: '100%', height: '100%'}}>
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <Animatable.View animation="bounceIn" style={styles.content}>
            <TextNormal
              props={props}
              style={[
                containerStyle.textHeaderWithMargin,
                containerStyle.whiteText,
              ]}
              text={t('login.name')}
            />
            <View style={styles.fieldContainer}>
              <TextInputFlat
                value={email}
                keyboardType="number-pad"
                onChangeText={(text) => setUserInfo({...userInfo, phone: text})}
                props={props}
                placeholder={t('login.emailOrPhone')}
                textInputStyle={styles.fieldEmailPhone}
              />
              <TextInputFlat
                value={password}
                onChangeText={(text) =>
                  setUserInfo({...userInfo, password: text})
                }
                props={props}
                hasRightIco
                secureText={showPassword}
                onPressIco={() => {
                  setShowPassword(!showPassword);
                }}
                ico={<Eye isOff={!showPassword} color={colors.white} />}
                placeholder={t('login.password')}
                textInputStyle={styles.fieldPassword}
              />
              <TextNormal
                props={props}
                text={t('login.forget')}
                style={styles.fieldForget}
                clickable
                onPress={() =>
                  NavigationService.navigate(Route.ScreenNames.ResetScreen)
                }
              />
              <GradientButton
                style={styles.signinButton}
                onPress={() => onLogin()}
                text={t('login.name')}
              />
            </View>
          </Animatable.View>
          <View style={styles.footerContainer}>
            <TouchableOpacity
              onPress={() =>
                NavigationService.navigate(ScreenNames.RegisterScreen)
              }
              style={[
                containerStyle.horContainer,
                styles.signUp,
                containerStyle.defaultMarginTop,
              ]}>
              <TextNormal
                props={props}
                text={t('login.dontHaveAccount')}
                style={styles.signUpMotto}
              />
              <TextNormal
                props={props}
                text={t('signUp.name')}
                style={styles.signUpTitle}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
        {isLoading ? <Loading /> : null}
      </ImageBackground>
    </View>
  );
};

export default withTheme(LoginScreen);
