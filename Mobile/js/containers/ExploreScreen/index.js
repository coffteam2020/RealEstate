import React, {useEffect} from 'react';
import {StatusBar, View} from 'react-native';
import {styles} from './style';
import {withTheme} from 'react-native-paper';
import {containerStyle} from '../../themes/styles';
import {useTranslation} from 'react-i18next';
import {useStores} from '../../store/useStore';
import GetLocation from 'react-native-get-location';

const ExploreScreen = (props) => {
  const {colorsApp} = props.theme;
  useEffect(() => {
    props?.navigation.addListener('willFocus', () => {
      getLocation();
    });
  }, []);

  const getLocation = async () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then((location) => {
        console.log(location);
      })
      .catch((error) => {
        const {code, message} = error;
        console.warn(code, message);
      });
  };

  return (
    <View style={[containerStyle.center, containerStyle.defaultBackground]}>
      <StatusBar barStyle={colorsApp.statusBar} />
      <View style={styles.content} />
    </View>
  );
};

export default withTheme(ExploreScreen);
