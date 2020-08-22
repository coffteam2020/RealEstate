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

const MateScreen = (props) => {
  const {colorsApp} = props.theme;
  const {t} = useTranslation();
  const {userStore} = useStores();

  return (
    <View style={[containerStyle.center, containerStyle.defaultBackground]}>
      <StatusBar barStyle={colorsApp.statusBar} />
      <View style={styles.content}>
        
      </View>
    </View>
  );
};

export default withTheme(MateScreen);
