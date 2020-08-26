/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
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
import {NavigationService} from '../../navigation';
import {ScreenNames} from '../../route/ScreenNames';
import {useStores} from '../../store/useStore';
import AxiosFetcher from '../../api/AxiosFetch';
import IALocalStorage from '../../shared/utils/storage/IALocalStorage';
import Loading from '../../shared/components/Loading';
import {useObserver} from 'mobx-react';

const MateScreenDetail = (props) => {
  const {colorsApp} = props.theme;
  const {t} = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const {userStore} = useStores();

  const item = props.navigation.state.params.data || {};
  const unfollow = async () => {
    setIsLoading(true);
    AxiosFetcher({
      method: 'GET',
      url: `user/${userStore?.userInfo?.id}/un-followup/${item.id}`,
      hasToken: true,
    })
      .then((data) => {
        ToastHelper.showSuccess(t('mate.unfollowActSuccess'));
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
          })
          .finally(() => {
            setTimeout(() => {
              NavigationService.goBack();
            }, 1000);
          });
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        ToastHelper.showError(t('mate.err'));
      });
  };
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
              text={item?.name || ''}
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
                text={`${t('mate.searchLocation')}: ${
                  item?.searchLocation || '🏙'
                }`}
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
                text={`${t('mate.looking')}: ${
                  item?.genderLookingFor || 'Male'
                }`}
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
                text={item?.aboutMe || '✌️'}
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
                NavigationService.navigate(ScreenNames.ChatRoomScreen, {
                  toUserData: {
                    id: item?.id,
                    name: item?.name || 'No name',
                    avatar: item?.avatar,
                  },
                });
              }}
            />
            {props.navigation.state.params.followed && (
              <GradientButton
                fromColor={colors.red}
                toColor={colors.red}
                text={t('mate.unfollowAct')}
                style={containerStyle.defaultMarginTop}
                onPress={() => {
                  unfollow();
                }}
              />
            )}
          </View>
        </View>
      </View>
    );
  };
  return useObserver(() => (
    <View style={[containerStyle.default, containerStyle.defaultBackground]}>
      <StatusBar barStyle={colorsApp.statusBar} />
      <SafeAreaView>
        <HeaderFull title={t('mate.detail')} hasButton />
        <ScrollView nestedScrollEnabled contentContainerStyle={styles.content}>
          {renderMates()}
        </ScrollView>
      </SafeAreaView>
      {isLoading && <Loading />}
    </View>
  ));
};

export default withTheme(MateScreenDetail);
