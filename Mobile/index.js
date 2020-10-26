/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import bgMessaging from './js/shared/utils/notification/bgMessaging';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);

AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => bgMessaging); // <-- Add this line
AppRegistry.registerHeadlessTask('ReactNativeFirebaseMessagingHeadlessTask', () => bgMessaging); // <-- Add this line
AppRegistry.registerHeadlessTask('RNCallKeepBackgroundMessage', () => ({ name, callUUID, handle }) => {
    // Make your call here
    bgMessaging()
    return Promise.resolve();
  });
//   AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => firebaseBackgroundMessage);