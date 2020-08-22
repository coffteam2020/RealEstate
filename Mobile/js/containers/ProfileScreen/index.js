import React from 'react';
import {StatusBar, View} from 'react-native';
import {styles} from './style';
import {withTheme} from 'react-native-paper';
import TextNormal from '../../shared/components/Text/TextNormal';
import {FONTSIZES} from '../../themes';
import {containerStyle} from '../../themes/styles';
import {useTranslation} from 'react-i18next';
import {colors} from '../../shared/utils/colors/colors';
import fonts from '../../shared/utils/fonts/fonts';

const ProfileScreen = (props) => {
  const {colorsApp} = props.theme;
  const {t} = useTranslation();

  return (
    <View style={[containerStyle.center, containerStyle.defaultBackground]}>
      <StatusBar barStyle={colorsApp.statusBar} />
      <View style={styles.content}>
      </View>
    </View>
  );
};

export default withTheme(ProfileScreen);
