/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { StatusBar, View, SafeAreaView, FlatList } from 'react-native';
import { styles } from './style';
import { withTheme } from 'react-native-paper';
import TextNormal from '../../shared/components/Text/TextNormal';
import { containerStyle } from '../../themes/styles';
import { useTranslation } from 'react-i18next';
import { useStores } from '../../store/useStore';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
import { ScreenWidth, ScreenHeight } from '../../shared/utils/dimension/Divices';
import { NavigationService } from '../../navigation';
import { ScreenNames } from '../../route/ScreenNames';
import HeaderFull from '../../shared/components/Header/HeaderFull';
import AxiosFetcher from '../../api/AxiosFetch';
import { ToastHelper } from '../../shared/components/ToastHelper';
import * as Animatable from 'react-native-animatable';
import Empty from '../../shared/components/Empty';
import { colors } from '../../shared/utils/colors/colors';
import { firebase } from '@react-native-firebase/database';
import IALocalStorage from '../../shared/utils/storage/IALocalStorage';
import { useObserver } from 'mobx-react';
import Constant from '../../shared/utils/constant/Constant';
import GradientButton from '../../shared/components/Buttons/GradientButton';

const GroupMateScreen = (props) => {
  const { colorsApp } = props.theme;
  const { t } = useTranslation();
  const { userStore } = useStores();
  const [liv, setLiv] = useState([]);
  const [fr, setFr] = useState([]);
  useEffect(() => {
    props.navigation.addListener('willFocus', () => {
      setFr([]);
      getUsers();
    })
    getUsers();
  }, []);

  const getUsers = async () => {
    AxiosFetcher({
      method: 'GET',
      url: 'user/' + userStore?.userInfo?.id,
      hasToken: true,
    })
      .then(async (val) => {
        if (val?.data !== '') {
          await IALocalStorage.setDetailUserInfo(val);
          userStore.userInfo = val;
          userStore.follows = val?.followers || [];
        } else {
          ToastHelper.showError(t('account.getInfoErr'));
        }
      })
      .catch(() => {
        ToastHelper.showError(t('account.getInfoErr'));
      });
  };
  const filterFollowing = async () => { };
  const renderMates = () => {
    if (userStore?.follows?.slice().length === 0) {
      return <Empty />;
    }
    return (
      <FlatList
        data={userStore?.follows?.slice()?.filter(a => fr?.indexOf(a) < 0)}
        scrollEnabled
        style={{
          width: ScreenWidth,
          marginTop: 10,
        }}
        keyExtractor={(item) => item?.id}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                setFr([...fr, item])
              }}
              style={[
                containerStyle.defaultMarginBottom,
                containerStyle.shadow,
              ]}>
              <Animatable.View animation="fadeIn" duration={1000} delay={50 * index} style={[styles.item, containerStyle.shadow]}>
                <FastImage
                  source={{ uri: item?.avatar }}
                  resizeMode="cover"
                  style={styles.avatar}
                />
                <View>
                  <TextNormal
                    text={item?.name || 'No name ❗️'}
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
                      text={item?.aboutMe || '😊'}
                      style={[
                        containerStyle.textInputHeaderDefault,
                        containerStyle.defaultTextMarginLeft,
                        { width: ScreenWidth * 0.5 },
                      ]}
                    />
                  </View>
                </View>
              </Animatable.View>
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
  const renderFR = () => {
    return (
      <FlatList
        data={fr}
        scrollEnabled
        horizontal
        style={{
          width: ScreenWidth,
          marginTop: 10,
        }}
        keyExtractor={(item) => item?.id}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                setFr(fr?.filter(a => a?.id !== item?.id))
              }}
              style={[
                containerStyle.defaultMarginBottom,
                containerStyle.shadow,
              ]}>
              <Animatable.View animation="slideInLeft" duration={1000} style={[styles.item, containerStyle.shadow, { marginEnd: 5 }]}>
                <FastImage
                  source={{ uri: item?.avatar }}
                  resizeMode="cover"
                  style={[styles.avatar, { marginEnd: 5 }]}
                />
              </Animatable.View>
            </TouchableOpacity>
          );
        }}
      />
    )
  }
  return useObserver(() => (
    <View style={[containerStyle.default, containerStyle.defaultBackground]}>
      <StatusBar barStyle={colorsApp.statusBar} />
      <SafeAreaView>
        <HeaderFull
          title={t('mate.title')}
          hasButton
          onPress={() => {
            // NavigationService.navigate(ScreenNames.List);
          }}
          rightIco={null}
        />
        <ScrollView nestedScrollEnabled contentContainerStyle={styles.content}>
          {renderFR()}
          <View style={{ height: 1, backgroundColor: 'black', width: '100%' }} />
          {renderMates()}
          <GradientButton
            disable={fr?.length === 0}
            style={{ marginTop: 20 }}
            onPress={() => {
              if (fr?.length === 1) {
                NavigationService.navigate(ScreenNames.ChatRoomScreen, { toUserData: fr?.[0] })
              } else {
                NavigationService.navigate(ScreenNames.ChatRoomGroupScreen, { users: fr })
              }
            }}
            text={t('common.confirm')}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  ));
};

export default withTheme(GroupMateScreen);
