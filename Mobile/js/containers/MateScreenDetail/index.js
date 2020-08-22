/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StatusBar, View, SafeAreaView} from 'react-native';
import {styles} from './style';
import {withTheme} from 'react-native-paper';
import TextNormal from '../../shared/components/Text/TextNormal';
import {containerStyle} from '../../themes/styles';
import {useTranslation} from 'react-i18next';
import {ScrollView} from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
import {ScreenWidth} from '../../shared/utils/dimension/Divices';
import HeaderFull from '../../shared/components/Header/HeaderFull';
import GradientButton from '../../shared/components/Buttons/GradientButton';
import {colors} from '../../shared/utils/colors/colors';
import {ToastHelper} from '../../shared/components/ToastHelper';

const MateScreenDetail = (props) => {
  const {colorsApp} = props.theme;
  const {t} = useTranslation();
  let item = props.navigation.state.params.data || {};
  const renderMates = () => {
    return (
      <View
        style={[
          containerStyle.defaultFull,
          containerStyle.defaultMarginBottom,
          containerStyle.shadow,
        ]}>
        <FastImage
          source={{uri: item?.avatar}}
          resizeMode="cover"
          style={styles.avatar}
        />
        <View
          style={[
            styles.item,
            containerStyle.shadow,
            containerStyle.defaultMarginTop,
          ]}>
          <View>
            <TextNormal
              text={item?.firstName + ' ' + item?.lastName || ''}
              style={[
                containerStyle.textHeader,
                containerStyle.defaultMarginBottom,
              ]}
            />
            <View style={[styles.gender, containerStyle.defaultMarginBottom]}>
              <Ionicons name="ios-transgender-outline" size={20} />
              <TextNormal
                text={item?.gender === 0 ? t('mate.male') : t('mate.female')}
                style={[
                  containerStyle.textInputHeaderDefault,
                  containerStyle.defaultTextMarginLeft,
                ]}
              />
            </View>
            <View style={[styles.gender, containerStyle.defaultMarginBottom]}>
              <Ionicons name="md-search-circle-outline" size={25} />
              <TextNormal
                numberOfLines={3}
                text={`${t('mate.searchLocation')}: ${item?.searchLocation}`}
                style={[
                  containerStyle.textInputHeaderDefault,
                  containerStyle.defaultTextMarginLeft,
                ]}
              />
            </View>
            <View style={[styles.gender, containerStyle.defaultMarginBottom]}>
              <Ionicons name="md-transgender-sharp" size={25} />
              <TextNormal
                numberOfLines={3}
                text={`${t('mate.looking')}: ${item?.genderLookingFor}`}
                style={[
                  containerStyle.textInputHeaderDefault,
                  containerStyle.defaultTextMarginLeft,
                ]}
              />
            </View>
            <View style={[styles.gender, containerStyle.defaultMarginBottom]}>
              <Ionicons name="ios-newspaper-outline" size={20} />
              <TextNormal
                numberOfLines={300}
                text={item?.note}
                style={[
                  containerStyle.textInputHeaderDefault,
                  containerStyle.defaultTextMarginLeft,
                  {width: ScreenWidth * 0.85},
                ]}
              />
            </View>
            <GradientButton
              fromColor={colors.purpleMain}
              toColor={colors.purpleMain}
              text={t('mate.chat')}
              onPress={() => {
                ToastHelper.showWarning(
                  'This feature is in progress working. Wait for next version',
                );
              }}
            />
          </View>
        </View>
      </View>
    );
  };
  return (
    <View style={[containerStyle.default, containerStyle.defaultBackground]}>
      <StatusBar barStyle={colorsApp.statusBar} />
      <SafeAreaView>
        <HeaderFull title={t('mate.detail')} hasButton />
        <ScrollView nestedScrollEnabled contentContainerStyle={styles.content}>
          {renderMates()}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default withTheme(MateScreenDetail);
