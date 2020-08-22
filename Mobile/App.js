/**
 * Author: UraNashel
 * Email: nguyenngoctan44@gmail.com
 */
import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import AppContainer from './js/route/MainStackRouter';
import {Provider as PaperProvider} from 'react-native-paper';
import {ToastHelper} from './js/shared/components/ToastHelper';
import DropdownAlert from './js/shared/components/DropDownAlert/DropdownAlert';
import {Text, Platform} from 'react-native';
import {initialMode} from 'react-native-dark-mode';
import {Appearance} from 'react-native-appearance';
import {CustomDarkTheme, CustomLightTheme} from './js/themes/index';
import {NavigationService} from './js/navigation';
import NetInfo from '@react-native-community/netinfo';
import firebase from '@react-native-firebase/app';
import ModalConnection from './js/shared/components/Modal/ModalConnection';
import Constant from './js/shared/utils/constant/Constant';
import {useObserver} from 'mobx-react';
import {useStores} from './js/store/useStore';
import ModalImage from './js/shared/components/Modal/ModalImage';
import {notificationInitialize} from './js/shared/utils/notification/init';
import IALocalStorage from './js/shared/utils/storage/IALocalStorage';
var PushNotification = require('react-native-push-notification');
import PushNotificationIOS from '@react-native-community/push-notification-ios';

// gets the current screen from navigation state
function getActiveRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getActiveRouteName(route);
  }
  return route.routeName;
}
const firebaseConfig = {
  ...Constant.FIREBASE,
  ...(Platform.OS === 'android'
    ? {appId: Constant.FIREBASE_SPECIFIC.appIdAndroid}
    : {appId: Constant.FIREBASE_SPECIFIC.appIdiOS}),
};
const App = () => {
  const [currentScreen, setCurrentScreen] = useState('');
  const {homeStore, userStore} = useStores();
  const colorScheme = Appearance.getColorScheme();
  const [isVisible, setIsVisible] = useState(false);
  // userStore?.setCurrentChatRoom('');
  const setThemeChange = () => {};
  const disableConsole = () => {
    console.log('App started in', initialMode, 'mode', colorScheme);
    console.disableYellowBox = true;
  };
  const removeScalingText = () => {
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = false;
  };
  const netWorkChange = () => {
    NetInfo.addEventListener((state) => {
      console.log('Connection type device with: ', state.type);
      console.log('Device is being connected? ', state.isConnected);
      setIsVisible(!state.isConnected);
    });
  };
  const connectFirebase = async () => {
    // Clear room local
    IALocalStorage.setRoom('');
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    await firebase.messaging().registerDeviceForRemoteMessages();
    await firebase.messaging().registerForRemoteNotifications();
    notificationInitialize(userStore, currentScreen);
  };
  const configure = () => {
    PushNotification.configure({
      // user accepted notification permission - register token
      onRegister: function (tokenData) {
        // handle device token
        // send token to server...
        // store in AsyncStorage...
      },
      // notification received / opened in-app event
      onNotification: function (notification) {
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      // outlining what permissions to accept
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
    });
  };
  useEffect(() => {
    configure();
    console.disableYellowBox = true;
    disableConsole();
    setThemeChange();
    removeScalingText();
    netWorkChange();
    connectFirebase();
  }, []);

  return useObserver(() => (
    <PaperProvider
      theme={homeStore.darkMode ? CustomDarkTheme : CustomLightTheme}>
      <AppContainer
        ref={(navigatorRef) =>
          NavigationService.setTopLevelNavigator(navigatorRef)
        }
        onNavigationStateChange={async (prevState, currentState) => {
          const currentScreen = getActiveRouteName(currentState);
          setCurrentScreen(currentScreen);
          console.log(`CurrentScreen ${currentScreen}`);
          await IALocalStorage.setScreen(currentScreen);
        }}
      />
      <DropdownAlert
        ref={(ref) => ToastHelper.setToasterDropDown(ref)}
        onClose={() => ToastHelper.invokeOnClose()}
        onTap={() => ToastHelper.invokeOnTap()}
      />
      <ModalConnection
        isVisible={isVisible}
        onPress={() => {
          setIsVisible(false);
        }}
      />
      <ModalImage
        isVisible={homeStore.shouldShowImageZoom}
        uri={homeStore.imageHasToShown}
      />
    </PaperProvider>
  ));
};
export default App;
