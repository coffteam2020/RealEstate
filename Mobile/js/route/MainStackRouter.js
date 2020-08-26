/* eslint-disable react/display-name */
import 'react-native-gesture-handler';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator, TransitionPresets} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import React from 'react';
import SplashScreen from '../containers/SplashScreen/index';
import LoginScreen from '../containers/Authentication/LoginScreen/index';
import RegisterScreen from '../containers/Authentication/RegisterScreen/index';
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';
import {Transition} from 'react-native-reanimated';
import ExploreScreen from '../containers/ExploreScreen';
import MateScreen from '../containers/MateScreen';
import MateScreenDetail from '../containers/MateScreenDetail';
import MessageScreen from '../containers/MessageScreen';
import LocationScreen from '../containers/LocationScreen';
import ProfileScreen from '../containers/ProfileScreen';
import Update from '../containers/ProfileScreen/Update';
import {colors} from '../shared/utils/colors/colors';
import TabbarComponentCustom from './TabbarComponentCustom';
import {Image, View} from 'react-native';
import {images} from '../../assets';
import styles from './styles';
import SocialScreen from '../containers/SocialScreen';
import NewPostScreen from '../containers/NewPostScreen';
import PostDetailScreen from '../containers/PostDetailScreen';

// ScreenNavigator for separately each screen into stack one
const MateScreenNavigator = createStackNavigator(
  {
    MateScreen: {screen: MateScreen},
    MateScreenDetail: {screen: MateScreenDetail},
  },
  {
    mode: 'modal',
    headerMode: 'none',
    initialRouteName: 'MateScreen',
  },
);
const SocialcreenNavigator = createStackNavigator(
  {
    SocialScreen: {screen: SocialScreen},
    NewPostScreen: {screen: NewPostScreen},
    PostDetailScreen: {screen: PostDetailScreen},
  },
  {
    mode: 'modal',
    headerMode: 'none',
    initialRouteName: 'SocialScreen',
  },
);
const ProfileNavigator = createStackNavigator(
  {
    ProfileScreen: {screen: ProfileScreen},
    Update: {
      screen: Update,
      navigationOptions: {
        gestureEnabled: true,
        cardOverlayEnabled: true,
        ...TransitionPresets.ModalPresentationIOS,
        headerShown: false,
      },
    },
  },
  {
    mode: 'modal',
    headerMode: 'none',
    initialRouteName: 'ProfileScreen',
  },
);
const Tabs = createBottomTabNavigator(
  {
    ExploreScreen: {
      screen: ExploreScreen,
      navigationOptions: {
        tabBarIcon: ({focused}) => {
          return (
            <View>
              <Image
                source={focused ? images.explorer : images.explorer_ico}
                style={focused ? styles.icon : styles.iconInactive}
              />
            </View>
          );
        },
        title: 'Explorer',
      },
    },
    MateScreenNavigator: {
      screen: MateScreenNavigator,
      navigationOptions: {
        tabBarIcon: ({focused}) => {
          return (
            <View>
              <Image
                source={focused ? images.mate : images.mate_ico}
                style={focused ? styles.icon : styles.iconInactive}
              />
            </View>
          );
        },
        title: 'Follow',
      },
    },
    LocationScreen: {
      screen: LocationScreen,
      navigationOptions: {
        tabBarIcon: ({focused}) => {
          return (
            <View>
              <Image
                source={focused ? images.location : images.location_ico}
                style={focused ? styles.icon : styles.iconInactive}
              />
            </View>
          );
        },
        title: 'Location',
      },
    },
    MessageScreen: {
      screen: SocialcreenNavigator,
      navigationOptions: {
        tabBarIcon: ({focused}) => {
          return (
            <View>
              <Image
                source={focused ? images.message : images.message_ico}
                style={focused ? styles.icon : styles.iconInactive}
              />
            </View>
          );
        },
        title: 'Message',
      },
    },
    ProfileNavigator: {
      screen: ProfileNavigator,
      navigationOptions: {
        tabBarIcon: ({focused}) => {
          return (
            <View>
              <Image
                source={focused ? images.profile : images.profile_ico}
                style={focused ? styles.icon : styles.iconInactive}
              />
            </View>
          );
        },
        title: 'Me',
      },
    },
  },
  {
    tabBarOptions: {
      showLabel: false,
      activeTintColor: colors.blackBackground,
      inactiveTintColor: colors.black_seventy,
    },
    tabBarComponent: (props) => <TabbarComponentCustom {...props} />,
  },
);
// SwitchNavigator for using the multiple stack in the same route
const AppBottombarSwitchNavigator = createAnimatedSwitchNavigator(
  {
    SplashScreen: {screen: SplashScreen},
    LoginScreen: {screen: LoginScreen},
    RegisterScreen: {screen: RegisterScreen},
    TabsScreen: {screen: Tabs},
  },
  {
    initialRouteName: 'SplashScreen',
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
