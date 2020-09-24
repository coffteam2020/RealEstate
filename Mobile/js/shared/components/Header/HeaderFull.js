/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { colors } from '../../utils/colors/colors';
import { SIZES, SPACINGS, RADIUS } from '../../../themes';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { StyleSheet, View, TouchableOpacity, Platform } from 'react-native';
import { NavigationService } from '../../../navigation';
import icons from '../../utils/icons/icons';
import { ScreenWidth, ScreenHeight } from '../../utils/dimension/Divices';
import Back from '../Icons/Back';
import * as devices from '../../utils/device/device';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TextNormal from '../Text/TextNormal';
import { containerStyle } from '../../../themes/styles';
import { withNavigation } from 'react-navigation';

const HeaderFull = ({ title, hasButton = false, rightIco, onPress }) => {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <TouchableOpacity
        style={{ width: ScreenWidth / 6 }}
        onPress={() => {
          NavigationService.goBack();
        }}>
        {hasButton && <Ionicons name="md-chevron-back-outline" size={30} />}
      </TouchableOpacity>
      <TextNormal
        text={title}
        style={[
          containerStyle.textHeader,
          containerStyle.defaultMarginBottom,
          {
            alignSelf: 'center',
            textAlign: 'center',
          },
        ]}
      />
      <View
        style={{
          width: ScreenWidth / 6,
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
          marginBottom: 20,
        }}>
        {rightIco && (
          <TouchableOpacity onPress={onPress}>{rightIco}</TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default withNavigation(HeaderFull);

const styles = StyleSheet.create({
  container: {
    borderRadius: RADIUS.backIco,
    width: ScreenWidth - 40,
    height: ScreenHeight / 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
    margin: 20,
    marginTop: Platform.OS === 'android' ? 10 : 0,
    marginBottom: 0,
  },
  text: {
    width: ScreenWidth * 0.6,
    height: SIZES.back.height,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
  },
});
