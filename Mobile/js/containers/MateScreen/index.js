/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { StatusBar, View, SafeAreaView, FlatList, Alert } from 'react-native';
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
import Empty from '../../shared/components/Empty';
import { colors } from '../../shared/utils/colors/colors';
import { firebase } from '@react-native-firebase/database';
import IALocalStorage from '../../shared/utils/storage/IALocalStorage';
import { useObserver } from 'mobx-react';
import Constant from '../../shared/utils/constant/Constant';

const MateScreen = (props) => {
  const { colorsApp } = props.theme;
  const { t } = useTranslation();
  const { userStore } = useStores();
  const [liv, setLiv] = useState([]);
  useEffect(() => {
    props.navigation.addListener('willFocus', () => {
      getUsers();
    })
    getUsers();
    getLiv();
  }, []);
  const getLiv = async () => {
    firebase.database().ref(Constant.SCHEMA.LIVESTREAM).on('value', async snapshot => {
      if (snapshot.val() != undefined) {
        let data = Object.values(snapshot.val()) || [];
        if (data && typeof data === 'object' && data?.length >= 0) {
          (data || [])?.forEach(element => {
            if (element && element?.status === 'LIVESTREAMING') {
              setLiv([...liv, element?.uid])
            }
          });
        }
        console.log(JSON.stringify(liv));
      }
    });
  }
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
        data={userStore?.follows?.slice()}
        scrollEnabled
        style={{
          width: ScreenWidth,
          height: ScreenHeight,
          marginTop: 10,
        }}
        keyExtractor={(item) => item?.id}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                NavigationService.navigate(ScreenNames.MateScreenDetail, {
                  data: item,
                  followed: true,
                });
              }}
              onLongPress={() => {
                Alert.alert(t('social.placeholder'), '', [
                  {
                    text: t('common.block'), onPress: () => {
                      setTimeout(() => {
                        ToastHelper.showSuccess(t('common.doneB'));
                      }, 1000);
                    }
                  },
                  {
                    text: t('common.delete'), onPress: () => {
                      setTimeout(() => {
                        ToastHelper.showSuccess(t('common.doneB'));
                      }, 1000);
                    }
                  }
                ])
              }}
              style={[
                containerStyle.defaultMarginBottom,
                containerStyle.shadow,
              ]}>
              <View style={[styles.item, containerStyle.shadow]}>
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
                  {liv?.includes(item?.id) &&
                    <View style={styles.gender}>
                      <Ionicons name="bonfire-outline" size={20} color={'red'} />
                      <TextNormal
                        numberOfLines={3}
                        text={'Livestreaming 💥'}
                        style={[
                          containerStyle.textInputHeaderDefault,
                          containerStyle.defaultTextMarginLeft,
                          { width: ScreenWidth * 0.5, color: 'red' },
                        ]}
                      />
                    </View>}
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
  return useObserver(() => (
    <View style={[containerStyle.default, containerStyle.defaultBackground]}>
      <StatusBar barStyle={colorsApp.statusBar} />
      <SafeAreaView>
        <HeaderFull
          title={t('mate.title')}
          onPress={() => {
            NavigationService.navigate(ScreenNames.List);
          }}
          rightIco={<Ionicons name="add" size={20} color={colors.blackInput} />}
        />
        <ScrollView nestedScrollEnabled contentContainerStyle={styles.content}>
          {renderMates()}
        </ScrollView>
      </SafeAreaView>
    </View>
  ));
};

export default withTheme(MateScreen);
