/* eslint-disable react/display-name */
import 'react-native-gesture-handler';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import React from 'react';
import SplashScreen from '../containers/SplashScreen/index';
import LoginScreen from '../containers/Authentication/LoginScreen/index';
import RegisterScreen from '../containers/Authentication/RegisterScreen/index';
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';
import {Transition} from 'react-native-reanimated';
import ExploreScreen from '../containers/ExploreScreen';
import MateScreen from '../containers/MateScreen';
import MessageScreen from '../containers/MessageScreen';
import LocationScreen from '../containers/LocationScreen';
import ProfileScreen from '../containers/ProfileScreen';
import {colors} from '../shared/utils/colors/colors';
import TabbarComponentCustom from './TabbarComponentCustom';
import {Image, View} from 'react-native';
import {images} from '../../assets';
import styles from './styles';

// ScreenNavigator for separately each screen into stack one
// const MainScreenNavigator = createStackNavigator(
//   {
// HomeScreen: {screen: HomeScreen},
// },
// {
//   mode: 'modal',
//   headerMode: 'none',
// initialRouteName: 'HomeScreen'
// },
// );
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
    MateScreen: {
      screen: MateScreen,
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
      screen: MessageScreen,
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
    ProfileScreen: {
      screen: ProfileScreen,
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
