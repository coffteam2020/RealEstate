/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {StatusBar, View} from 'react-native';
import {styles} from './style';
import {withTheme} from 'react-native-paper';
import TextNormal from '../../shared/components/Text/TextNormal';
import {FONTSIZES} from '../../themes';
import {containerStyle} from '../../themes/styles';
import Constant from '../../shared/utils/constant/Constant';
import {NavigationService} from '../../navigation';
import {ScreenNames} from '../../route/ScreenNames';
import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-community/async-storage';
import i18n from '../../shared/utils/locale/i18n';
import IALocalStorage from '../../shared/utils/storage/IALocalStorage';
import {useStores} from '../../store/useStore';
import {colors} from '../../shared/utils/colors/colors';
import fonts from '../../shared/utils/fonts/fonts';

const SplashScreen = (props) => {
  const {colorsApp} = props.theme;
  const {t} = useTranslation();
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
      let userInfo = await IALocalStorage.getDetailUserInfo();
      if (userInfo?.accessToken) {
        NavigationService.navigate(ScreenNames.TabsScreen);
      } else {
        NavigationService.navigate(ScreenNames.LoginScreen);
      }
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

export default withTheme(SplashScreen);
