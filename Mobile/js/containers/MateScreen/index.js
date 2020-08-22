/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StatusBar, View, SafeAreaView, FlatList} from 'react-native';
import {styles} from './style';
import {images} from '../../../assets/index';
import {withTheme} from 'react-native-paper';
import TextNormal from '../../shared/components/Text/TextNormal';
import {containerStyle} from '../../themes/styles';
import {useTranslation} from 'react-i18next';
import {useStores} from '../../store/useStore';
import {colors} from '../../shared/utils/colors/colors';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
import GradientButton from '../../shared/components/Buttons/GradientButton';
import {ScreenWidth, ScreenHeight} from '../../shared/utils/dimension/Divices';
import {NavigationService} from '../../navigation';
import {ScreenNames} from '../../route/ScreenNames';
import HeaderFull from '../../shared/components/Header/HeaderFull';

const MOCK = [
  {
    id: 0,
    firstName: 'Mayuko',
    lastName: 'Nashel',
    avatar: 'https://i1.sndcdn.com/avatars-000143568666-ksxxz6-t500x500.jpg',
    gender: 0,
    searchLocation: 'Binh Thanh, Ho Chi Minh',
    genderLookingFor: 'Female',
    note:
      'I want to make a openable chances for everyone wanna deal with my property. Home is da best',
  },
  {
    id: 1,
    firstName: 'Tech',
    lastName: 'Lead',
    searchLocation: 'Phuong 10, Go Vap, Ho Chi Minh',
    avatar:
      'https://image.cnbcfm.com/api/v1/image/106139275-1568921126945facebookyt.jpg?v=1568922003&w=1600&h=900',
    gender: 1,
    genderLookingFor: 'Male',
    note:
      'Ex-Google tech lead Patrick Shyu explains how to learn to buy property quickly and easily, with this one weird trick! It`s so simple with this 1-step! Are you looking ? ...',
  },
  {
    id: 2,
    firstName: 'Ura',
    lastName: 'Mickey',
    genderLookingFor: 'Male',
    searchLocation: 'Phuong 13, Nhat Chi Mai, Tan Binh, Ho Chi Minh',
    avatar:
      'https://i1.wp.com/innovation-village.com/wp-content/uploads/2020/05/Twitter-CEO-Jack-Dorsey-pledges-over-a-quarter-of-his-780x470-1.jpg?fit=780%2C470&ssl=1',
    gender: 1,
    note:
      'Jack Patrick Dorsey is an American technology entrepreneur and philanthropist who is the co-founder and CEO of Twitter, and the founder and CEO of Square, a financial payments company.',
  },
];
const MateScreen = (props) => {
  const {colorsApp} = props.theme;
  const {t} = useTranslation();
  const renderMates = () => {
    return (
      <FlatList
        data={MOCK}
        scrollEnabled
        style={{
          width: ScreenWidth,
          height: ScreenHeight,
          marginTop: 10,
        }}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              onPress={() => {
                NavigationService.navigate(ScreenNames.MateScreenDetail, {
                  data: item,
                });
              }}
              style={[
                containerStyle.defaultMarginBottom,
                containerStyle.shadow,
              ]}>
              <View style={[styles.item, containerStyle.shadow]}>
                <FastImage
                  source={{uri: item?.avatar}}
                  resizeMode="cover"
                  style={styles.avatar}
                />
                <View>
                  <TextNormal
                    text={item?.firstName || ''}
                    style={containerStyle.textHeaderSmallNormal}
                  />
                  <View style={styles.gender}>
                    <Ionicons name="ios-transgender-outline" size={20} />
                    <TextNormal
                      text={
                        item?.gender === 0 ? t('mate.male') : t('mate.female')
                      }
                      style={[
                        containerStyle.textInputHeaderDefault,
                        containerStyle.defaultTextMarginLeft,
                      ]}
                    />
                  </View>
                  <View style={styles.gender}>
                    <Ionicons name="ios-newspaper-outline" size={20} />
                    <TextNormal
                      numberOfLines={3}
                      text={item?.note}
                      style={[
                        containerStyle.textInputHeaderDefault,
                        containerStyle.defaultTextMarginLeft,
                        {width: ScreenWidth * 0.5},
                      ]}
                    />
                  </View>
                </View>
              </View>
              <View
                style={[
                  styles.line,
                  containerStyle.defaultMarginTop,
                  containerStyle.shadowWhite,
                ]}
              />
            </TouchableOpacity>
          );
        }}
      />
    );
  };
  return (
    <View style={[containerStyle.default, containerStyle.defaultBackground]}>
      <StatusBar barStyle={colorsApp.statusBar} />
      <SafeAreaView>
        <HeaderFull title={t('mate.title')} />
        <ScrollView nestedScrollEnabled contentContainerStyle={styles.content}>
          {renderMates()}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default withTheme(MateScreen);
