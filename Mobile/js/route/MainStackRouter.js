/* eslint-disable react/display-name */
import 'react-native-gesture-handler';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator, TransitionPresets} from 'react-navigation-stack';
import React from 'react';
import SplashScreen from '../containers/SplashScreen/index';
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';
import {Transition} from 'react-native-reanimated';
import WelcomeScreen from '../containers/WelcomeScreen/index';
import LoginScreen from '../containers/Authentication/LoginScreen/index';
import RegisterScreen from '../containers/Authentication/RegisterScreen/index';
// ScreenNavigator for separately each screen into stack one
// const MainScreenNavigator = createStackNavigator(
//   {
    // HomeScreen: {screen: HomeScreen},
    // MedicalScreen: {screen: MedicalScreen},
    // EditProfileScreen: {screen: EditProfileScreen},
    // StoreScreen: {screen: StoreScreen},
    // ItemsScreen: {screen: ItemsScreen},
    // MessageScreen: {screen: MessageScreen},
    // ChatRoomScreen: {screen: ChatRoomScreen},
    // AddFriendScreen: {screen: AddFriendScreen},
    // PinMessageScreen: {screen: PinMessageScreen},
    // PinNewMessageScreen: {screen: PinNewMessageScreen},
    // AboutScreen: {screen: AboutScreen},
    // ResetScreen: {screen: ResetScreen},
    // ResetPassScreen: {screen: ResetPassScreen},
    // ChangePassDoneScreen: {screen: ChangePassDoneScreen},
    // SettingsScreen: {screen: SettingsScreen},
    // NotificationScreen: {screen: NotificationScreen},
    // PigeonMessageScreen: {screen: PigeonMessageScreen},
    // Create: {screen: Create},
    // Livestream: {screen: Livestream},
    // BlockFriendScreen: {screen: BlockFriendScreen},
    // VideoCallScreen: {screen: VideoCallScreen},
    // InformationRoom: {
    //   screen: InformationRoom,
    //   navigationOptions: {
    //     gestureEnabled: true,
    //     cardOverlayEnabled: true,
    //     ...TransitionPresets.ModalPresentationIOS,
    //     headerShown: false,
    //   },
    // },
    // SpotifyScreen: {screen: SpotifyScreen},
    // TranslateScreen: {
    //   screen: TranslateScreen,
    //   navigationOptions: {
    //     gestureEnabled: true,
    //     cardOverlayEnabled: true,
    //     ...TransitionPresets.ModalPresentationIOS,
    //     headerShown: false,
    //   },
    // },
    // PlayList: {screen: PlayList},
    // Recording: {screen: Recording},
    // TermScreen: {screen: TermScreen},
    // RankScreen: {screen: RankScreen},
  // },
  // {
  //   mode: 'modal',
  //   headerMode: 'none',
    // initialRouteName: 'HomeScreen'
  // },
// );
// const AuthenticationStack = createStackNavigator(
//   {
//     RegisterScreen: {screen: RegisterScreen},
//     OTPVerifyScreen: {screen: OTPVerifyScreen},
//     ResetScreen: {screen: ResetScreen},
//     ForgetPassScreen: {screen: ForgetPassScreen},
//     ResetPassScreen: {screen: ResetPassScreen},
//     ChangePassDoneScreen: {screen: ChangePassDoneScreen},
//   },
//   {
//     mode: 'modal',
//     headerMode: 'none',
//   },
// );
// SwitchNavigator for using the multiple stack in the same route
const AppBottombarSwitchNavigator = createAnimatedSwitchNavigator(
  {
    SplashScreen: {screen: SplashScreen},
	  WelcomeScreen: {screen: WelcomeScreen},
    LoginScreen: {screen: LoginScreen},
    RegisterScreen: {screen: RegisterScreen},
  },
  {
    mode: 'modal',
    headerMode: 'none',
    transition: (
      <Transition.Together>
        <Transition.Out type="fade" durationMs={300} interpolation="easeIn" />
        <Transition.In type="fade" durationMs={200} />
      </Transition.Together>
    ),
  },
);

export default createAppContainer(AppBottombarSwitchNavigator);
