/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {StatusBar, View, SafeAreaView, FlatList, Alert} from 'react-native';
import {styles} from './style';
import {withTheme} from 'react-native-paper';
import TextNormal from '../../shared/components/Text/TextNormal';
import {containerStyle} from '../../themes/styles';
import {useTranslation} from 'react-i18next';
import {useStores} from '../../store/useStore';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
import {ScreenWidth, ScreenHeight} from '../../shared/utils/dimension/Divices';
import {NavigationService} from '../../navigation';
import {ScreenNames} from '../../route/ScreenNames';
import HeaderFull from '../../shared/components/Header/HeaderFull';
import AxiosFetcher from '../../api/AxiosFetch';
import {ToastHelper} from '../../shared/components/ToastHelper';
import Empty from '../../shared/components/Empty';
import Constant from '../../shared/utils/constant/Constant';
import Loading from '../../shared/components/Loading';

const List = (props) => {
  const {colorsApp} = props.theme;
  const {t} = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [followed, setIsFollowed] = useState(false);
  const {userStore} = useStores();
  useEffect(() => {
    props.navigation.addListener('willFocus', () => {
      getUsers();
    });
    getUsers();
  }, []);
  const getUsers = async () => {
    setIsLoading(true);
    AxiosFetcher({
      method: 'GET',
      url: 'user/findAllWithPagination?limit=100000&offset=0&sortBy=name',
      hasToken: true,
    })
      .then((data) => {
        setIsLoading(false);
        userStore.users = data?.content || [];
        let arr = [];
        let users = userStore?.users;
        for (let i = 0; i < users.length; i++) {
          if (users[i].followers?.length > 0) {
            for (let j = 0; j < users[i]?.followers?.length; j++) {
              if (users[i]?.followers[j].id === userStore?.userInfo?.id) {
                arr.push(users[i]);
                break;
              }
            }
          }
        }
        userStore.follows = arr;
      })
      .catch(() => {
        setIsLoading(false);
        ToastHelper.showError(t('mate.err'));
      });
  };
  const follow = async (item) => {
    setIsLoading(true);
    AxiosFetcher({
      method: 'GET',
      url: `user/${userStore?.userInfo?.id}/followup/${item.id}`,
      hasToken: true,
    })
      .then((data) => {
        userStore.follows = [...userStore?.follows, item];
        console.log(JSON.stringify(userStore.follows));
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        ToastHelper.showError(t('mate.err'));
      });
  };
  const filterFollowing = async () => {};
  const renderMates = () => {
    return (
      <FlatList
        data={userStore?.users?.slice()}
        scrollEnabled
        style={{
          width: ScreenWidth,
          //   height: ScreenHeight,
          marginTop: 10,
        }}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => {
          if (item?.id === userStore?.userInfo?.id) {
            return null;
          }
          return (
            <TouchableOpacity
              onPress={() => {
                Alert.alert(t('mate.followAsk'), t('mate.followAskContent'), [
                  {
                    text: `${t('mate.followAct')}`,
                    onPress: () => {
                      follow(item);
                    },
                  },
                  {
                    text: t('mate.detail'),
                    onPress: () => {
                      NavigationService.navigate(ScreenNames.MateScreenDetail, {
                        data: item,
                      });
                    },
                  },
                  {
                    text: t('common.cancel'),
                    onPress: () => {
                      //
                    },
                  },
                ]);
              }}
              style={[
                containerStyle.defaultMarginBottom,
                containerStyle.shadow,
              ]}>
              <View style={[styles.item, containerStyle.shadow]}>
                <FastImage
                  source={{
                    uri: item?.avatar || Constant.MOCKING_DATA.PLACE_HOLDER,
                  }}
                  resizeMode="cover"
                  style={styles.avatar}
                />
                <View>
                  <TextNormal
                    text={item?.name || 'No name ❌'}
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
                        {width: ScreenWidth * 0.5},
                      ]}
                    />
                  </View>
                  <View
                    style={[
                      {
                        flexDirection: 'row',
                        alignItems: 'center',
                        width: '65%',
                        justifyContent: 'space-between',
                      },
                      containerStyle.defaultMarginTopSmall,
                    ]}>
                    <TextNormal
                      clickable
                      onPress={() => {}}
                      text={`${t('mate.followAct')}`}
                      style={[containerStyle.textLink]}
                    />
                    <Ionicons
                      name="heart"
                      size={25}
                      color={
                        userStore?.follows.findIndex(
                          (item) => item?.id === userStore?.userInfo?.id,
                        ) >= 0
                          ? 'red'
                          : 'black'
                      }
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
        <HeaderFull title={t('mate.follow')} hasButton />
        <ScrollView nestedScrollEnabled contentContainerStyle={styles.content}>
          {renderMates()}
        </ScrollView>
      </SafeAreaView>
      {isLoading && <Loading />}
    </View>
  );
};

export default withTheme(List);