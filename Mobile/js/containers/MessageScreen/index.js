import React, {useEffect} from 'react';
import {StatusBar, View, Image} from 'react-native';
import {styles} from './style';
import {images} from '../../../assets/index';
import {withTheme} from 'react-native-paper';
import TextNormal from '../../shared/components/Text/TextNormal';
import {FONTSIZES} from '../../themes';
import {containerStyle} from '../../themes/styles';
import Constant from '../../shared/utils/constant/Constant';
import {NavigationService} from '../../navigation';
import Route, {ScreenNames} from '../../route/ScreenNames';
import * as Animatable from 'react-native-animatable';
import {useTranslation} from 'react-i18next';
import LogManager from '../../shared/utils/logging/LogManager';
import AsyncStorage from '@react-native-community/async-storage';
import i18n from '../../shared/utils/locale/i18n';
import IALocalStorage from '../../shared/utils/storage/IALocalStorage';
import {useStores} from '../../store/useStore';
import {colors} from '../../shared/utils/colors/colors';
import {ScreenWidth, ScreenHeight} from '../../shared/utils/dimension/Divices';
import fonts from '../../shared/utils/fonts/fonts';

const MessageScreen = (props) => {
  const {colorsApp} = props.theme;
  const {t} = useTranslation();
  const {userStore} = useStores();
  const loadLocalLanguage = async () => {
    const preferredLang = await AsyncStorage.getItem('lang');
    if (preferredLang) {
      i18n.changeLanguage(preferredLang);
    } else {
      i18n.changeLanguage('vn');
    }
  };
  useEffect(() => {
    loadLocalLanguage();
    let timeOut = setTimeout(async () => {
      let isNotFirstTime = await IALocalStorage.getTokenFirstTime();
      // if (isNotFirstTime) {
      let isLoggedIn = await IALocalStorage.getUserInfo();
      console.log(isLoggedIn);
      if (isLoggedIn) {
        userStore.setUserInfo({});
        NavigationService.navigate(ScreenNames.HomeScreen);
      } else {
        NavigationService.navigate(ScreenNames.LoginScreen);
      }
      // } else {
      // 	NavigationService.navigate(ScreenNames.WelcomeScreen);
      // }
    }, Constant.SPLASH_TIME_OUT);
    return () => {
      this.clearTimeout(timeOut);
    };
  }, []);

  return (
    <View style={[containerStyle.center, containerStyle.defaultBackground]}>
      <StatusBar barStyle={colorsApp.statusBar} />
      <View style={styles.content}>
        <TextNormal
          style={{
            fontSize: FONTSIZES.xxxLarge,
            color: colors.whiteBackground,
            letterSpacing: 0.5,
            fontFamily: fonts.family.nunito.bold,
          }}
          text={t('appName')}
        />
      </View>
    </View>
  );
};

export default withTheme(MessageScreen);
