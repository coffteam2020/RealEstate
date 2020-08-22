/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {StatusBar, View, TouchableOpacity, Keyboard} from 'react-native';
import {styles} from './style';
import {withTheme} from 'react-native-paper';
import TextNormal from '../../../shared/components/Text/TextNormal';
import {containerStyle} from '../../../themes/styles';
import {useTranslation} from 'react-i18next';
import TextInputFlat from '../../../shared/components/TextInput/TextInputFlat';
import {colors} from '../../../shared/utils/colors/colors';
('');
import GradientButton from '../../../shared/components/Buttons/GradientButton';
import Validator from '../../../shared/utils/validator/Validator';
import {ToastHelper} from '../../../shared/components/ToastHelper';
import Loading from '../../../shared/components/Loading';
import Eye from '../../../shared/components/Icons/Eye';
import {NavigationService} from '../../../navigation';
import {ScreenNames} from '../../../route/ScreenNames';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {ImageBackground} from 'react-native';
import {images} from '../../../../assets';
import * as Animatable from 'react-native-animatable';
import CheckBox from '@react-native-community/checkbox';
import AxiosFetcher from '../../../api/AxiosFetch';
import IALocalStorage from '../../../shared/utils/storage/IALocalStorage';

const RegisterScreen = (props) => {
  const {colorsApp} = props.theme;
  const {t} = useTranslation();
  const [] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [password] = useState('');
  const [confirmPass] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isAccept, setIsAccept] = useState(false);
  const [userInfo, setUserInfo] = useState({});

  const onConfirm = async () => {
    Keyboard.dismiss();
    if (Validator.checkEmptyField(userInfo?.phone || '')) {
      ToastHelper.showError(t('error.empty'));
      return;
    }
    if (Validator.checkEmptyField(userInfo?.password || '')) {
      ToastHelper.showError(t('error.empty'));
      return;
    }
    if (
      Validator.checkConfirmPassword(
        userInfo?.password || '',
        userInfo?.passwordConfirm || '',
      )
    ) {
      ToastHelper.showError(t('reset.notMatch'));
      return;
    }
    if (!userInfo?.password || !userInfo?.phone) {
      ToastHelper.showError(t('error.empty'));
      return;
    }
    if (!isAccept) {
      ToastHelper.showError(t('error.accept'));
      return;
    }
    // Register flow
    setIsLoading(true);
    AxiosFetcher({
      method: 'POST',
      url: 'auth/signup',
      data: {
        password: userInfo?.password,
        phoneNumber: userInfo?.phone,
      },
    })
      .then(async (data) => {
        if (data?.accessToken) {
          ToastHelper.showSuccess(t('signUp.signUpDone'));
          setTimeout(() => {
            NavigationService.navigate(ScreenNames.LoginScreen);
          }, 1000);
        } else {
          ToastHelper.showError(t('signUp.error'));
        }
      })
      .catch((error) => {
        ToastHelper.showError(t('signUp.error'));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <View style={[containerStyle.center]}>
      <StatusBar barStyle={colorsApp.statusBar} />
      <ImageBackground
        source={images.bg_main}
        style={{width: '100%', height: '100%'}}>
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <Animatable.View animation="bounceIn" style={styles.content}>
            <TextNormal
              props={props}
              text={t('signUp.name')}
              style={[containerStyle.textHeaderWithMargin]}
            />

            <View style={styles.fieldContainer}>
              <TextInputFlat
                onChangeText={(text) => setUserInfo({...userInfo, phone: text})}
                props={props}
                keyboardType="number-pad"
                placeholder={t('login.emailOrPhone')}
                textInputStyle={styles.fieldEmailPhone}
              />
              <TextInputFlat
                onChangeText={(text) =>
                  setUserInfo({...userInfo, password: text})
                }
                placeholder={t('reset.password')}
                onPressIco={() => {
                  setShowPassword(!showPassword);
                }}
                secureText={showPassword}
                props={props}
                hasRightIco
                ico={<Eye isOff={!showPassword} color={colors.white} />}
                style={styles.fieldItemTop}
                textInputStyle={styles.fieldPassword}
              />
              <TextInputFlat
                onChangeText={(text) =>
                  setUserInfo({...userInfo, passwordConfirm: text})
                }
                placeholder={t('reset.confirmPassword')}
                onPressIco={() => {
                  setShowConfirmPassword(!showConfirmPassword);
                }}
                secureText={showConfirmPassword}
                props={props}
                hasRightIco
                ico={<Eye isOff={!showConfirmPassword} color={colors.white} />}
                style={styles.fieldItemTop}
                textInputStyle={styles.fieldPassword}
              />
              <View style={styles.termWrap}>
                <CheckBox
                  disabled={false}
                  value={isAccept}
                  style={{width: 20, height: 20}}
                  onValueChange={(newValue) => setIsAccept(newValue)}
                />
                <TextNormal
                  props={props}
                  text={t('signUp.agreement')}
                  style={styles.signUpMotto}
                />
                <TextNormal
                  props={props}
                  text={t('signUp.term')}
                  style={styles.termCondition}
                />
              </View>
              <GradientButton
                onPress={() => onConfirm()}
                text={t('signUp.name')}
                style={styles.button}
              />
            </View>
          </Animatable.View>
          <View style={styles.footerContainer}>
            <TouchableOpacity
              onPress={() =>
                NavigationService.navigate(ScreenNames.LoginScreen)
              }
              style={[
                containerStyle.horContainerNearlyDefaultCenter,
                containerStyle.defaultMarginTop,
              ]}>
              <TextNormal
                numberOfLines={2}
                props={props}
                text={t('register.hadAccount')}
                style={styles.mottoEmail}
              />
              <TextNormal
                numberOfLines={2}
                props={props}
                text={t('login.name')}
                style={[styles.mottoEmail, styles.sigInMotto]}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
        {isLoading ? <Loading /> : null}
      </ImageBackground>
    </View>
  );
};

export default withTheme(RegisterScreen);
