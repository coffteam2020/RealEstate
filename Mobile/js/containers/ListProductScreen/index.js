/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {StatusBar, View, SafeAreaView} from 'react-native';
import {styles} from './style';
import {images} from '../../../assets/index';
import {withTheme} from 'react-native-paper';
import TextNormal from '../../shared/components/Text/TextNormal';
import {SIZES} from '../../themes';
import {containerStyle} from '../../themes/styles';
import {useTranslation} from 'react-i18next';
import {useStores} from '../../store/useStore';
import {colors} from '../../shared/utils/colors/colors';
import FastImage from 'react-native-fast-image';
import GradientButton from '../../shared/components/Buttons/GradientButton';
import TextInputFlatLeftIconTouchable from '../../shared/components/TextInput/TextInputFlatLeftIconTouchable';
import icons from '../../shared/utils/icons/icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import { ToastHelper } from '../../shared/components/ToastHelper';

const ListProductScreen = (props) => {
  const {colorsApp} = props.theme;
  const {t} = useTranslation();
  const [from, setFrom] = useState('');
  const [enableFrom, setEnableFrom] = useState(false);
  const [to, setTo] = useState('');
  const [enableTo, setEnableTo] = useState(false);

  const renderSearchFrom = () => {
    return (
      <View style={styles.search}>
        <TextInputFlatLeftIconTouchable
          keyboardType="default"
          props={props}
          hasLeftIcon
          value={from || ''}
          onChangeText={(text) => {
            setFrom(text);
            setEnableFrom(text !== '');
          }}
          ico={icons.IC_LOCATION}
          placeHolder={t('location.from')}
          textInputStyle={[
            styles.fieldEmailPhone,
            {width: enableFrom ? '90%' : '100%'},
          ]}
        />
        {enableFrom && (
          <TouchableOpacity
            onPress={() => {
              setEnableFrom(false);
              setFrom('');
            }}
            style={{marginTop: 25, height: SIZES.textInput.height}}>
            <Ionicons
              name="ios-close-circle-outline"
              size={30}
              color={colors.red}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };
  const renderSearchTo = () => {
    return (
      <View style={styles.search}>
        <TextInputFlatLeftIconTouchable
          keyboardType="default"
          value={to || ''}
          props={props}
          hasLeftIcon
          onChangeText={(text) => {
            setTo(text || '');
            setEnableTo(text !== '');
          }}
          ico={icons.IC_LOCATION_ACTIVE}
          placeHolder={t('location.to')}
          textInputStyle={[
            styles.fieldEmailPhone,
            {width: enableTo ? '90%' : '100%'},
          ]}
        />
        {enableTo && (
          <TouchableOpacity
            onPress={() => {
              setEnableTo(false);
              setTo('');
            }}
            style={{marginTop: 25, height: SIZES.textInput.height}}>
            <Ionicons
              name="ios-close-circle-outline"
              size={30}
              color={colors.red}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };
  return (
    <View style={[containerStyle.default, containerStyle.defaultBackground]}>
      <StatusBar barStyle={colorsApp.statusBar} />
      <SafeAreaView>
        <TextNormal
          text={t('location.near')}
          style={[containerStyle.textHeader, containerStyle.textCenter]}
        />
        <ScrollView contentContainerStyle={styles.content}>
          <View>
            {renderSearchFrom()}
            {renderSearchTo()}
          </View>
          <FastImage
            source={images.locationbg}
            style={styles.location}
            resizeMode="contain"
          />
          <TextNormal
            text={t('location.motto')}
            style={containerStyle.textContent}
            numberOfLines={1000}
          />
          <TextNormal
            text={t('location.currentLocation')}
            clickable
            onPress={() => {}}
            style={[
              containerStyle.textLink,
              containerStyle.textDefaultNormal,
              containerStyle.defaultMarginTop,
              containerStyle.defaultMarginBottom,
            ]}
            numberOfLines={1000}
          />
          <GradientButton
            fromColor={colors.purpleMain}
            toColor={colors.purpleMain}
            text={t('location.submit')}
            onPress={() => {
              ToastHelper.showWarning(
                'This feature is in progress working. Wait for next version',
              );
            }}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default withTheme(ListProductScreen);
