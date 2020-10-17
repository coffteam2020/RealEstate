/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {StatusBar, View, SafeAreaView} from 'react-native';
import {styles} from './style';
import {withTheme} from 'react-native-paper';
import {containerStyle} from '../../themes/styles';
import {useTranslation} from 'react-i18next';
import {useStores} from '../../store/useStore';
import {colors} from '../../shared/utils/colors/colors';
import {ScrollView} from 'react-native-gesture-handler';
import GradientButton from '../../shared/components/Buttons/GradientButton';
import {NavigationService} from '../../navigation';
import AxiosFetcher from '../../api/AxiosFetch';
import HeaderFull from '../../shared/components/Header/HeaderFull';
import IALocalStorage from '../../shared/utils/storage/IALocalStorage';
import {ToastHelper} from '../../shared/components/ToastHelper';
import {useObserver} from 'mobx-react';
import TextInputFlat from '../../shared/components/TextInput/TextInputFlat';
import Loading from '../../shared/components/Loading';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const Update = (props) => {
  const {colorsApp} = props.theme;
  const {t} = useTranslation();
  const {userStore} = useStores();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({});

  const updateProfile = async () => {
    console.log(JSON.stringify(user));
    setIsLoading(true);
    let userInfo = await IALocalStorage.getDetailUserInfo();
    AxiosFetcher({
      method: 'POST',
      url: `user/${userInfo?.id}/update`,
      data: {
        ...user,
        id: userStore?.userInfo?.id,
      },
      hasToken: true,
    })
      .then((val) => {
        setIsLoading(false);
        if (val?.id) {
          ToastHelper.showSuccess(t('account.success'));
          setTimeout(() => {
            NavigationService.goBack();
          }, 1000);
        } else {
          ToastHelper.showError(t('account.fail'));
        }
      })
      .catch(() => {
        setIsLoading(false);
        ToastHelper.showError(t('account.fail'));
      });
  };

  const renderMe = () => {
    return (
      <View style={[containerStyle.center, containerStyle.shadow]}>
        <TextInputFlat
          keyboardType="default"
          props={props}
          onChangeText={(text) => {
            setUser({...user, name: text});
          }}
          text={t('account.name')}
          placeholder={userStore?.userInfo?.name || ''}
          textInputStyle={[
            styles.fieldEmailPhone,
            containerStyle.defaultMarginBottom,
          ]}
        />
        <TextInputFlat
          keyboardType="default"
          props={props}
          onChangeText={(text) => {
            setUser({...user, dateOfBirth: text});
          }}
          text={t('account.dob')}
          placeholder={userStore?.userInfo?.dateOfBirth || ''}
          textInputStyle={[
            styles.fieldEmailPhone,
            containerStyle.defaultMarginBottom,
          ]}
        />
        <TextInputFlat
          keyboardType="number-pad"
          props={props}
          onChangeText={(text) => {
            setUser({...user, phoneNumber: text});
          }}
          text={t('account.phone')}
          disabled
          placeholder={`${userStore?.userInfo?.phoneNumber}` || ''}
          textInputStyle={[
            styles.fieldEmailPhone,
            containerStyle.defaultMarginBottom,
          ]}
        />
        <TextInputFlat
          keyboardType="default"
          props={props}
          onChangeText={(text) => {
            setUser({...user, language: text});
          }}
          text={t('account.language')}
          disabled
          placeholder={`${userStore?.userInfo?.language}` || ''}
          textInputStyle={[
            styles.fieldEmailPhone,
            containerStyle.defaultMarginBottom,
          ]}
        />
        <TextInputFlat
          keyboardType="default"
          props={props}
          onChangeText={(text) => {
            setUser({...user, email: text});
          }}
          text={t('account.email')}
          placeholder={userStore?.userInfo?.email || ''}
          textInputStyle={[
            styles.fieldEmailPhone,
            containerStyle.defaultMarginBottom,
          ]}
        />
        <TextInputFlat
          keyboardType="default"
          props={props}
          onChangeText={(text) => {
            setUser({...user, gender: text});
          }}
          text={t('account.sex')}
          placeholder={userStore?.userInfo?.gender || ''}
          textInputStyle={[
            styles.fieldEmailPhone,
            containerStyle.defaultMarginBottom,
          ]}
        />
        <TextInputFlat
          keyboardType="default"
          props={props}
          onChangeText={(text) => {
            setUser({...user, address: text});
          }}
          text={t('account.address')}
          placeholder={userStore?.userInfo?.address || ''}
          textInputStyle={[
            styles.fieldEmailPhone,
            containerStyle.defaultMarginBottom,
          ]}
        />
        <TextInputFlat
          keyboardType="default"
          props={props}
          onChangeText={(text) => {
            setUser({...user, currency: text});
          }}
          text={t('account.currentcy')}
          placeholder={userStore?.userInfo?.currency || ''}
          textInputStyle={[
            styles.fieldEmailPhone,
            containerStyle.defaultMarginBottom,
          ]}
        />
        <TextInputFlat
          keyboardType="default"
          props={props}
          onChangeText={(text) => {
            setUser({...user, aboutMe: text});
          }}
          text={t('account.about')}
          placeholder={userStore?.userInfo?.aboutMe || ''}
          textInputStyle={[
            styles.fieldEmailPhone,
            containerStyle.defaultMarginBottom,
          ]}
        />
        <GradientButton
          fromColor={colors.purpleMain}
          toColor={colors.purpleMain}
          text={t('location.submit')}
          style={[containerStyle.defaultMarginTop]}
          onPress={() => {
            updateProfile();
          }}
        />
        <GradientButton
          fromColor={colors.red}
          toColor={colors.red}
          text={t('common.cancel')}
          style={[containerStyle.defaultMarginTop]}
          onPress={() => {
            NavigationService.goBack();
          }}
        />
      </View>
    );
  };
  return useObserver(() => (
    <View
      style={[
        containerStyle.default,
        containerStyle.defaultBackground,
        {paddingTop: 20},
      ]}>
      <StatusBar barStyle={colorsApp.statusBar} />
      <SafeAreaView>
        <HeaderFull title={t('account.update')} />
        <KeyboardAwareScrollView
          nestedScrollEnabled
          contentContainerStyle={styles.content}>
          {renderMe()}
        </KeyboardAwareScrollView>
      </SafeAreaView>
      {isLoading && <Loading />}
    </View>
  ));
};

export default withTheme(Update);
