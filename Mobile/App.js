/**
 * Author: UraNashel
 * Email: nguyenngoctan44@gmail.com
 */
import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import AppContainer from './js/route/MainStackRouter';
import { Provider as PaperProvider } from 'react-native-paper';
import { ToastHelper } from './js/shared/components/ToastHelper';
import DropdownAlert from './js/shared/components/DropDownAlert/DropdownAlert';
import { Text, Platform, PermissionsAndroid } from 'react-native';
import { DeviceEventEmitter } from 'react-native';
import IncomingCall from 'react-native-incoming-call';
import RNCallKeep from 'react-native-callkeep';
// import VoipPushNotification from 'react-native-voip-push-notification';
import { initialMode } from 'react-native-dark-mode';
import { Appearance } from 'react-native-appearance';
import { CustomDarkTheme, CustomLightTheme } from './js/themes/index';
import { NavigationService } from './js/navigation';
// import NetInfo from '@react-native-community/netinfo';
import notifee from '@notifee/react-native';
import firebase from '@react-native-firebase/app';
import ModalConnection from './js/shared/components/Modal/ModalConnection';
import Constant from './js/shared/utils/constant/Constant';
import { useObserver } from 'mobx-react';
import { useStores } from './js/store/useStore';
import ModalImage from './js/shared/components/Modal/ModalImage';
import { displayIncoming, notificationInitialize } from './js/shared/utils/notification/init';
import IALocalStorage from './js/shared/utils/storage/IALocalStorage';
var PushNotification = require('react-native-push-notification');
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import BackgroundTimer from 'react-native-background-timer';
BackgroundTimer.start();
// Platform.OS === 'ios' && VoipPushNotification.wakeupByPush;
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
    ? { appId: Constant.FIREBASE_SPECIFIC.appIdAndroid }
    : { appId: Constant.FIREBASE_SPECIFIC.appIdiOS }),
};
const initNo = async () => {
  const options = {
		ios: {
			appName: 'Dapp Premium',
		},
		android: {
			alertTitle: 'Permissions required',
			alertDescription: 'This application needs to access your phone accounts',
			cancelButton: 'Cancel',
			okButton: 'ok',
			imageName: 'phone_account_icon',
		}
	};

	RNCallKeep.setup(options).then(accepted => {
		RNCallKeep.setAvailable(true);
	});
	RNCallKeep.setAvailable(true);
  // if (Platform.OS === "android") {
  //   /**
  //    * App open from killed state (headless mode)
  //   */
  //   const payload = await IncomingCall.getExtrasFromHeadlessMode();
  //   console.log('launchParameters', payload);
  //   if (payload) {
  //     // Start call action here. You probably want to navigate to some CallRoom screen with the payload.uuid.
  //     displayIncoming(['sa', 'VIDEO_CALL','dsa']);
  //   }

  //   /**
  //    * App in foreground / background: listen to call events and determine what to do next
  //   */
  //   DeviceEventEmitter.addListener("endCall", payload => {
  //     // End call action here
  //   });
  //   DeviceEventEmitter.addListener("answerCall", payload => {
  //     // Start call action here. You probably want to navigate to some CallRoom screen with the payload.uuid.
  //     displayIncoming(['sa', 'VIDEO_CALL','dsa']);
  //   });
  // }
  PushNotification.configure({
    // (optional) Called when Token is generated (iOS and Android)
    onRegister: function(token) {
      // console.log("TOKEN:", token);

      const deviceToken = token.token;
    },

    // (required) Called when a remote or local notification is opened or received
    onNotification: function(notification) {
      // console.log("NOTIFICATION:", notification);
      displayIncoming(notification?.alert?.body?.split("#") || notification?.data?.body?.split("#"));
      // process the notification

      // required on iOS only (see fetchCompletionHandler docs: https://github.com/react-native-community/react-native-push-notification-ios)
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    },

    // ANDROID ONLY: GCM or FCM Sender ID (product_number) (optional - not required for local notifications, but is need to receive remote push notifications)
    senderID: "YOUR GCM (OR FCM) SENDER ID",

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
      alert: true,
      badge: true,
      sound: true
    },

    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,

    /**
     * (optional) default: true
     * - Specified if permissions (ios) and token (android and ios) will requested or not,
     * - if not, you must call PushNotificationsHandler.requestPermissions() later
     */
    requestPermissions: true
  });
}
const App = () => {
  const [currentScreen, setCurrentScreen] = useState('');
  const { homeStore, userStore } = useStores();
  const colorScheme = Appearance.getColorScheme();
  const [isVisible, setIsVisible] = useState(false);
  // userStore?.setCurrentChatRoom('');
  const setThemeChange = () => { };
  const disableConsole = () => {
    // console.log('App started in', initialMode, 'mode', colorScheme);
    console.disableYellowBox = true;
  };
  const removeScalingText = () => {
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = false;
  };
  const netWorkChange = () => {
    // NetInfo.addEventListener((state) => {
    //   console.log('Connection type device with: ', state.type);
    //   console.log('Device is being connected? ', state.isConnected);
    //   setIsVisible(!state.isConnected);
    // });
  };
  const connectFirebase = async () => {
    // Clear room local
    IALocalStorage.setRoom('');
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    // await firebase.messaging().registerDeviceForRemoteMessages();
    // await firebase.messaging().registerForRemoteNotifications();
    notificationInitialize(userStore, currentScreen);
  };
  const configure = () => {
    // if (Platform.OS === 'ios') {
      
    //   VoipPushNotification.requestPermissions(); // --- optional, you can use another library to request permissions
    //   VoipPushNotification.registerVoipToken(); // --- required

    //   VoipPushNotification.addEventListener('register', (token) => {
    //     // --- send token to your apn provider server
    //     console.log(token);
    //   });

    //   VoipPushNotification.addEventListener('localNotification', (notification) => {
    //     // --- when user click local push
    //   });

    //   VoipPushNotification.addEventListener('notification', (notification) => {
    //     // --- when receive remote voip push, register your VoIP client, show local notification ... etc
    //     //this.doRegisterOrSomething();

    //     // --- This  is a boolean constant exported by this module
    //     // --- you can use this constant to distinguish the app is launched by VoIP push notification or not
    //     if (VoipPushNotification.wakeupByPush) {
    //       // this.doSomething()

    //       // --- remember to set this static variable back to false
    //       // --- since the constant are exported only at initialization time, and it will keep the same in the whole app
    //       // VoipPushNotification.wakeupByPush = false;
    //     }


    //     // --- optionally, if you `addCompletionHandler` from the native side, once you have done the js jobs to initiate a call, call `completion()`
    //     VoipPushNotification.onVoipNotificationCompleted(notification.getData().uuid);


    //     /**
    //      * Local Notification Payload
    //      *
    //      * - `alertBody` : The message displayed in the notification alert.
    //      * - `alertAction` : The "action" displayed beneath an actionable notification. Defaults to "view";
    //      * - `soundName` : The sound played when the notification is fired (optional).
    //      * - `category`  : The category of this notification, required for actionable notifications (optional).
    //      * - `userInfo`  : An optional object containing additional notification data.
    //      */
    //     VoipPushNotification.presentLocalNotification({
    //       alertBody: "hello! " + notification.getMessage()
    //     });
    //   });
    // }
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
  connectLiv = async () => {
    const user = await IALocalStorage.getDetailUserInfo();
    firebase.database().ref(Constant.SCHEMA.LIVESTREAM).on('value', async snapshot => {
      if (snapshot.val() != undefined) {
        let data = Object.values(snapshot.val()) || [];
        if (data && typeof data === 'object' && data?.length >= 0) {
          (data || [])?.forEach(element => {
            if (element?.status === 'LIVESTREAMING') {
              if (userStore?.follows?.filter(item => item?.id === element?.uid)?.length > 0) {
                ToastHelper.showSuccess('Your friend, ' + element?.ownerUserId?.name + 'is livestreaming. \nGo to friend screen and join now! 🔥');
                return;
              }
            }
          });

        }
      }
    });
  }
  useEffect(() => {
    connectFirebase();
    configure();
    initNo();
    console.disableYellowBox = true;
    disableConsole();
    setThemeChange();
    removeScalingText();
    netWorkChange();
    connectLiv()
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
          // console.log(`CurrentScreen ${currentScreen}`);
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
