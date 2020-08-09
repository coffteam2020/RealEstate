/* eslint-disable react/display-name */
import 'react-native-gesture-handler';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator, TransitionPresets} from 'react-navigation-stack';
import React from 'react';
import HomeScreen from '../containers/CoreFeatures/HomeScreen/index';
import MedicalScreen from '../containers/CoreFeatures/MedicalScreen/index';
import MessageScreen from '../containers/CoreFeatures/Messages/MessageScreen/index';
import ChatRoomScreen from '../containers/CoreFeatures/Messages/ChatRoomScreen/index';
import AddFriendScreen from '../containers/CoreFeatures/Messages/AddFriendScreen/index';
import EditProfileScreen from '../containers/CoreFeatures/EditProfileScreen/index';
import SplashScreen from '../containers/SplashScreen/index';
import WelcomeScreen from '../containers/WelcomeScreen/index';
import ForgetPassScreen from '../containers/ForgetPassScreen/index';
import ResetPassScreen from '../containers/ResetPassScreen/index';
import LoginScreen from '../containers/Authentication/LoginScreen/index';
import RegisterScreen from '../containers/Authentication/RegisterScreen/index';
import PinMessageScreen from '../containers/CoreFeatures/PinMessageScreen/index';
import OTPVerifyScreen from '../containers/Authentication/OTPVerifyScreen/index';
import ChangePassDoneScreen from '../containers/ChangePassDoneScreen/index';
import ResetScreen from '../containers/Authentication/ResetScreen/index';
import StoreScreen from '../containers/CoreFeatures/StoreScreen/index';
import ItemsScreen from '../containers/CoreFeatures/ItemsScreen/index';
import TermScreen from '../containers/CoreFeatures/TermScreen/index';
import RankScreen from '../containers/CoreFeatures/RankScreen/index';
import BlockFriendScreen from '../containers/CoreFeatures/BlockFriendScreen/index';

import NotificationScreen from '../containers/CoreFeatures/NotificationScreen/index';
import SettingsScreen from '../containers/CoreFeatures/SettingsScreen/index';
import PinNewMessageScreen from '../containers/CoreFeatures/PingNewMessageScreen/index';
import Livestream from '../containers/CoreFeatures/Livestream/index';
import PlayList from '../containers/CoreFeatures/Playlist/index';
import Recording from '../containers/CoreFeatures/Recording/index';
import SpotifyScreen from '../containers/CoreFeatures/SpotifyScreen/index';
import InformationRoom from '../containers/CoreFeatures/Livestream/InformationRoom';
import VideoCallScreen from '../containers/CoreFeatures/VideoCallScreen/index';
import TranslateScreen from '../containers/CoreFeatures/TranslateScreen/index';
import PigeonMessageScreen from '../containers/CoreFeatures/PigeonMessageScreen/index';
import Create from '../containers/CoreFeatures/PigeonMessageScreen/Create';
import AboutScreen from '../containers/CoreFeatures/AboutScreen/index';
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';
import {Transition} from 'react-native-reanimated';

// ScreenNavigator for separately each screen into stack one
const MainScreenNavigator = createStackNavigator(
  {
    HomeScreen: {screen: HomeScreen},
    MedicalScreen: {screen: MedicalScreen},
    EditProfileScreen: {screen: EditProfileScreen},
    StoreScreen: {screen: StoreScreen},
    ItemsScreen: {screen: ItemsScreen},
    MessageScreen: {screen: MessageScreen},
    ChatRoomScreen: {screen: ChatRoomScreen},
    AddFriendScreen: {screen: AddFriendScreen},
    PinMessageScreen: {screen: PinMessageScreen},
    PinNewMessageScreen: {screen: PinNewMessageScreen},
    AboutScreen: {screen: AboutScreen},
    ResetScreen: {screen: ResetScreen},
    ResetPassScreen: {screen: ResetPassScreen},
    ChangePassDoneScreen: {screen: ChangePassDoneScreen},
    SettingsScreen: {screen: SettingsScreen},
    NotificationScreen: {screen: NotificationScreen},
    PigeonMessageScreen: {screen: PigeonMessageScreen},
    Create: {screen: Create},
    Livestream: {screen: Livestream},
    BlockFriendScreen: {screen: BlockFriendScreen},
    VideoCallScreen: {screen: VideoCallScreen},
    InformationRoom: {
      screen: InformationRoom,
      navigationOptions: {
        gestureEnabled: true,
        cardOverlayEnabled: true,
        ...TransitionPresets.ModalPresentationIOS,
        headerShown: false,
      },
    },
    SpotifyScreen: {screen: SpotifyScreen},
    TranslateScreen: {
      screen: TranslateScreen,
      navigationOptions: {
        gestureEnabled: true,
        cardOverlayEnabled: true,
        ...TransitionPresets.ModalPresentationIOS,
        headerShown: false,
      },
    },
    PlayList: {screen: PlayList},
    Recording: {screen: Recording},
    TermScreen: {screen: TermScreen},
    RankScreen: {screen: RankScreen},
  },
  {
    mode: 'modal',
    headerMode: 'none',
    // initialRouteName: 'HomeScreen'
  },
);
const AuthenticationStack = createStackNavigator(
  {
    RegisterScreen: {screen: RegisterScreen},
    OTPVerifyScreen: {screen: OTPVerifyScreen},
    ResetScreen: {screen: ResetScreen},
    ForgetPassScreen: {screen: ForgetPassScreen},
    ResetPassScreen: {screen: ResetPassScreen},
    ChangePassDoneScreen: {screen: ChangePassDoneScreen},
  },
  {
    mode: 'modal',
    headerMode: 'none',
  },
);
// SwitchNavigator for using the multiple stack in the same route
const AppBottombarSwitchNavigator = createAnimatedSwitchNavigator(
  {
    SplashScreen: {screen: SplashScreen},
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
