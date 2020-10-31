/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {colors} from '../../utils/colors/colors';
import {SIZES, SPACINGS, RADIUS, FONTSIZES} from '../../../themes';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {StyleSheet, View, TouchableOpacity, Platform} from 'react-native';
import {NavigationService} from '../../../navigation';
import icons from '../../utils/icons/icons';
import {ScreenWidth, ScreenHeight} from '../../utils/dimension/Divices';
import Back from '../Icons/Back';
import * as devices from '../../utils/device/device';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TextNormal from '../Text/TextNormal';
import {containerStyle} from '../../../themes/styles';
import FastImage from 'react-native-fast-image';
import Constant from '../../../shared/utils/constant/Constant';
import moment from 'moment'
import {color} from 'react-native-reanimated';
import fonts from '../../../shared/utils/fonts/fonts';

const HeaderFullPostDetail = ({title, hasButton = false, rightIco, onPress, avatar, name, createdAt, onDetail}) => {
  return (
    <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'flex-start', marginTop: SPACINGS.avg}} onPress={onDetail}>
      <TouchableOpacity
        style={{width: ScreenWidth / 7}}
        onPress={() => {
          hasButton ? NavigationService.goBack() : {};
        }}>
        {hasButton && <Ionicons name="md-chevron-back-outline" size={30} />}
      </TouchableOpacity>
      <FastImage
        source={{
          uri: avatar || Constant.MOCKING_DATA.NO_IMG_PLACE_HOLDER,
        }}
        resizeMode="cover"
        style={styles.avatar}
      />
      <View style={{display: "flex", flexDirection: "column"}}>
      <TextNormal
        text={name}
        numberOfLines={2}
        style={[
          {
            fontSize: FONTSIZES.large,
            fontFamily: fonts.family.nunito.bold,
            alignSelf: 'flex-start',
            width: '85%'
          },
        ]}
      />
      <TextNormal
        text={createdAt ? moment(createdAt).format("DD/MM/YYYY hh:mm"): ""}
        style={[
          {
            fontSize: 12,
            alignSelf: 'flex-start',
            color: colors.gray_new
          },
        ]}
      />
      </View>
      <View
        style={{
          width: ScreenWidth / 6,
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
          marginBottom: 10,
        }}>
        {rightIco && (
          <TouchableOpacity onPress={onPress}>{rightIco}</TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default HeaderFullPostDetail;

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
  avatar: {
    width: ScreenWidth * 0.1,
    height: ScreenWidth * 0.1,
	borderRadius: ScreenWidth * 0.6,
	marginRight: SPACINGS.avg
  },
});
