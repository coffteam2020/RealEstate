/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {StatusBar, View, SafeAreaView, FlatList, Alert, TextInput} from 'react-native';
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
import IALocalStorage from '../../shared/utils/storage/IALocalStorage';
import {useObserver} from 'mobx-react';

const List = (props) => {
  const {colorsApp} = props.theme;
  const {t} = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [followed, setIsFollowed] = useState(false);
  const {userStore} = useStores();
  const [data, setData] = useState([]);
  
  useEffect(() => {
    getUsers();
  }, []);

  const onChangeText = (text) => {
    setData(userStore?.users?.filter(i => i.name?.includes(text)));
  };

  const getUsers = async () => {
    setIsLoading(true);
    AxiosFetcher({
      method: 'GET',
      url: 'user/findAllWithPagination?limit=100000&offset=0&sortBy=name',
      hasToken: true,
    })
      .then((data) => {
        setIsLoading(false);
        setData(data?.content || []);
        
        userStore.users = data?.content || [];
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
      url: `user/${userStore?.userInfo?.id}/followup/${item?.id}`,
      hasToken: true,
    })
      .then((data) => {
        getUsers();
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
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        ToastHelper.showError(t('mate.err'));
      })
      .finally(() => {
        setTimeout(() => {
          NavigationService.goBack();
        }, 1000);
      });
  };
  const filterFollowing = async () => {};
  const renderMates = () => {
    
    return (
      <FlatList
        data={data}
        scrollEnabled
        style={{
          width: ScreenWidth,
          paddingBottom: 100,
          marginTop: 10,
        }}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => {
          if(item?.id === userStore?.userInfo?.id) return null;
          // if (
          //   item?.id === userStore?.userInfo?.id ||
          //   userStore?.follows?.slice().findIndex((a) => a.id === item?.id) >= 0
          // ) {
          //   return null;
          // }
          // console.log(
          //   userStore?.follows?.slice().findIndex((a) => a.id === item?.id),
          // );
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
                      text={`${t('mate.followAct')}${
                        userStore?.follows
                          .slice()
                          .findIndex((a) => a?.id === item?.id) >= 0
                          ? 'ed'
                          : ''
                      }`}
                      style={[containerStyle.textLink]}
                    />
                    <Ionicons
                      name="heart"
                      size={25}
                      color={
                        userStore?.follows
                          .slice()
                          .findIndex((a) => a?.id === item?.id) >= 0
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
  return useObserver(() => (
    <View style={[containerStyle.default, containerStyle.defaultBackground]}>
      <StatusBar barStyle={colorsApp.statusBar} />
      <SafeAreaView>
        <HeaderFull title={t('mate.follow')} hasButton />
        <TextInput
          onChangeText={onChangeText}
          style={styles.inputSearchView}
          placeholder={t('mate.search')}
        >

        </TextInput>
          {renderMates()}
      </SafeAreaView>
      {isLoading && <Loading />}
    </View>
  ));
};

export default withTheme(List);
