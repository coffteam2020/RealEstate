/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  View,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Alert,
} from 'react-native';
import { styles } from './style';
import { withTheme } from 'react-native-paper';
import { containerStyle } from '../../themes/styles';
import { useTranslation } from 'react-i18next';
import { useStores } from '../../store/useStore';
import Swiper from 'react-native-swiper';
import Axios from 'axios';
import GetLocation from 'react-native-get-location';
import { images } from '../../../assets';
import { Linking } from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import FastImage from 'react-native-fast-image';
import TextInputFlatLeftIconTouchable from '../../shared/components/TextInput/TextInputFlatLeftIconTouchable';
import { ScreenHeight, ScreenWidth } from '../../shared/utils/dimension/Divices';
import TextNormal from '../../shared/components/Text/TextNormal';
import icons from '../../shared/utils/icons/icons';
import Feather from 'react-native-vector-icons/Feather';
import { colors } from '../../shared/utils/colors/colors';
import AxiosFetcher from '../../api/AxiosFetch';
import { NavigationService } from '../../navigation';
import { ScreenNames } from '../../route/ScreenNames';
import { firebase } from '@react-native-firebase/messaging';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import IALocalStorage from '../../shared/utils/storage/IALocalStorage';
import { ToastHelper } from '../../shared/components/ToastHelper';
import { useObserver } from 'mobx-react';

const HOME_BANNERS = [
  { imgUrl: images.home1 },
  { imgUrl: images.home2 },
  { imgUrl: images.home3 },
  { imgUrl: images.home4 },
  { imgUrl: images.home5 },
];
const HOME_BANNERS_CLIENTS = [
  { imgUrl: images.home1, text: "Hưng Thịnh land, hãy là nhà đầu tư thông minh" },
  { imgUrl: images.home2, text: "Căn hộ Đức khải. Nơi xứng đáng để bạn trải nghiệm" },
  { imgUrl: images.home3, text: "Vinhomes, nơi ươm mầm tiêu chuẩn cuộc sống" },
  { imgUrl: images.home4, text: "Phú Hoàng resident, tiêu chuẩn tương lai" },
  { imgUrl: images.home5, text: "Phú Hoàng 2 resident, tiêu chuẩn tương lai" },
];

const ExploreScreen = (props) => {
  const { colorsApp } = props.theme;
  const { t } = useTranslation();
  const { userStore } = useStores();
  const [lo, setLo] = useState({});
  const [marker, setMarkers] = useState([]);

  const BTNS = [
    {
      title: t('explorer.video_call'),
      icon: images.ten,
      onPress: () =>
        NavigationService.navigate(ScreenNames.VideoCall, {
          isGroup: true,
          isNew: true
        }),
    },
    {
      title: t('explorer.qr'),
      icon: images.wr,
      onPress: () =>
        NavigationService.navigate(ScreenNames.Scanner, {
          key: t('explorer.qr'),
        }),
    },
    {
      title: t('explorer.nearby'), icon: images.five, onPress: () =>
        NavigationService.navigate(ScreenNames.LocationScreen, {
          key: t('explorer.hurry'),
        }),
    },
    {
      title: t('explorer.ownerOnsite'), icon: images.homesd, onPress: () =>
        NavigationService.navigate(ScreenNames.PropertyListScreen, {
          key: t('explorer.properties'),
          type: "PROPERTY"
        }),
    },
  ];
  const BTNS3 = [
    {
      title: t('explorer.properties'),
      icon: images.noowner,
      onPress: () =>
        NavigationService.navigate(ScreenNames.PropertyListScreen, {
          key: t('explorer.properties'),
          type: "PROPERTY"
        }),
    },
    {
      title: t('explorer.restaurant'),
      icon: images.home3s,
      onPress: () =>
        NavigationService.navigate(ScreenNames.PropertyListScreen, {
          key: t('explorer.restaurant'),
          type: "RESTAURANT"
        }),
    },
    {
      title: t('explorer.livestream'),
      icon: images.space,
      onPress: () =>
        NavigationService.navigate(ScreenNames.LiveStream, {
          key: t('explorer.social'),
        }),
    },

    {
      title: t('explorer.social'),
      icon: images.home4s,
      onPress: () =>
        NavigationService.navigate(ScreenNames.SocialScreen, {
          key: t('explorer.social'),
        }),
    },
  ];
  const BTNS4 = [
    {
      title: t('explorer.coffee'),
      icon: images.cafe,
      onPress: () =>
        NavigationService.navigate(ScreenNames.CoffeeScreen, {
          key: t('explorer.coffee'),
          type: "COFFEE"
        }),
    },
    {
      title: t('explorer.restaurant'),
      icon: images.cafe,
      onPress: () =>
        NavigationService.navigate(ScreenNames.RestaurantScreen, {
          key: t('explorer.restaurant'),
          type: "RESTAURANT"
        }),
    },{},{}
  ];
  const BTNS2 = [
    {
      title: t('explorer.admin'),
      icon: images.app,
      onPress: () =>
        NavigationService.navigate(ScreenNames.SocialScreen, {
          key: t('explorer.admin'),
          isBlog: true,
        }),
    },
    {
      title: t('explorer.dMark'),
      icon: images.hurry,
      onPress: () =>
        NavigationService.navigate(ScreenNames.WebScreen, {
          url: 'https://dmark.shop',
        }),
      color: 'green',
      iconName: 'cloud-drizzle',
      iconColor: colors.whiteBackground,
    },
    {
      title: t('explorer.dShare'),
      icon: images.six,
      onPress: () =>
        NavigationService.navigate(ScreenNames.WebScreen, {
          url: 'https://dtechno.tech',
        }),
      color: colors.blue_dodger,
      iconName: 'chrome',
      iconColor: colors.whiteBackground,
    },
    {
      title: t('explorer.dCar'),
      icon: images.nearby,
      onPress: () =>
        NavigationService.navigate(ScreenNames.WebScreen, {
          url: 'http://cardtechno.store',
        }),
      color: colors.red_cinnabar,
      iconName: 'crosshair',
      iconColor: colors.whiteBackground,
    },
  ];
  const MOCK = [
    {
      address: 'Go Vap',
      amenities: 'string',
      areaUnit: 'string',
      availability: 0,
      availabilityDate: '2020-08-22T13:29:39.522Z',
      bathRoom: 0,
      bedRoom: 0,
      bookingAmount: 0,
      createdOn: 0,
      description: 'string',
      id: 0,
      leaseDuration: true,
      leaseDurationMonth: 0,
      modifiedOn: 0,
      phoneContact: 0,
      photo: [
        'https://media1.reatimes.vn/media/uploaded/37/2017/12/10/dichvuchuyenphatnhanhtuquan1.jpg',
      ],
      priceOrMonthlyRent: 0,
      projectName: 'string',
      propertyArea: 0,
      propertyFor: 'string',
      propertyOnFloor: 0,
      propertyType: 'string',
      rating: 0,
      reservedParking: 0,
      totalFloor: 0,
      videos: ['string'],
      youAre: 'string',
    },
    {
      address: 'Binh Thanh',
      amenities: 'string',
      areaUnit: 'string',
      availability: 0,
      availabilityDate: '2020-08-22T13:29:39.522Z',
      bathRoom: 0,
      bedRoom: 0,
      bookingAmount: 0,
      createdOn: 0,
      description: 'string',
      id: 0,
      leaseDuration: true,
      leaseDurationMonth: 0,
      modifiedOn: 0,
      phoneContact: 0,
      photo: [
        'https://media1.reatimes.vn/media/uploaded/37/2017/12/10/dichvuchuyenphatnhanhtuquan1.jpg',
      ],
      priceOrMonthlyRent: 0,
      projectName: 'string',
      propertyArea: 0,
      propertyFor: 'string',
      propertyOnFloor: 0,
      propertyType: 'string',
      rating: 0,
      reservedParking: 0,
      totalFloor: 0,
      videos: ['string'],
      youAre: 'string',
    },
    {
      address: 'Quan 1',
      amenities: 'string',
      areaUnit: 'string',
      availability: 0,
      availabilityDate: '2020-08-22T13:29:39.522Z',
      bathRoom: 0,
      bedRoom: 0,
      bookingAmount: 0,
      createdOn: 0,
      description: 'string',
      id: 0,
      leaseDuration: true,
      leaseDurationMonth: 0,
      modifiedOn: 0,
      phoneContact: 0,
      photo: [
        'https://media1.reatimes.vn/media/uploaded/37/2017/12/10/dichvuchuyenphatnhanhtuquan1.jpg',
      ],
      priceOrMonthlyRent: 0,
      projectName: 'string',
      propertyArea: 0,
      propertyFor: 'string',
      propertyOnFloor: 0,
      propertyType: 'string',
      rating: 0,
      reservedParking: 0,
      totalFloor: 0,
      videos: ['string'],
      youAre: 'string',
    },
  ];
  useEffect(() => {
    getSearchTrend();
    getProfile();
    getPropertyList();
    props?.navigation.addListener('willFocus', () => {
      getSearchTrend();
      getProfile();
      getPropertyList();
    });
  }, []);
  const getPropertyList = async () => {
    AxiosFetcher({
      method: 'GET',
      url: '/property/findAllWithPagination/?limit=1000&offset=0&sortBy=id',
      hasToken: true,
    })
      .then((val) => {
        if (val?.content !== '') {
          let datas = val?.content || [];
          // console.log('========' + JSON.stringify(datas));
          var arr = [];

          for (let i = 0; i < datas?.length; i++) {
            Axios.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent(datas[i]?.address) + '&key=AIzaSyB5vqnxvHdaTdgKY1E8AsaBxs_FS9HEiCM').then(val => {
              let a = val?.data;
              if (a?.results?.length > 0) {
                // console.log(a?.results?.[0]?.geometry?.location);
                // console.log(a.results?.[0]?.geometry?.location);
                // if (a.results?.[0]?.geometry?.location) {

                arr = [...arr, {
                  latitude: a.results?.[0]?.geometry?.location?.lat,
                  longitude: a?.results?.[0]?.geometry?.location?.lng,
                }]
                // console.log("============" + arr.length);
                setMarkers(arr?.slice());
                // }
              }
            })
          }
          // console.log("============" + arr.length);
          

        } else {
          // ToastHelper.showError(t('account.getInfoErr'));
        }
      })
      .catch((error) => {
        // ToastHelper.showError(t('account.getInfoErr'));
      });
  };
  const getUsers = async () => {
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

    const fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      // console.log('Token FCM: ' + fcmToken);
      AxiosFetcher({
        method: 'POST',
        url: 'user/' + userStore?.userInfo?.id + '/fcmtoken',
        data: `${fcmToken}`,
        hasToken: true,
      })
        .then(async () => {
        })
        .catch(() => {

        });
    }
  };
  const getProfile = async () => {
    let userInfo = await IALocalStorage.getDetailUserInfo();
    AxiosFetcher({
      method: 'GET',
      url: 'user/' + userInfo?.id,
      hasToken: true,
    })
      .then(async (val) => {
        if (val?.data !== '') {
          await IALocalStorage.setDetailUserInfo(val);
          userStore.userInfo = val;
          getUsers();
        } else {
          ToastHelper.showError(t('account.getInfoErr'));
        }
      })
      .catch(() => {
        ToastHelper.showError(t('account.getInfoErr'));
      });

  };
  const tryOpenIAP = async (url) => {
    try {
      if (await InAppBrowser.isAvailable()) {
        InAppBrowser.open(url, {
          modalEnabled: true,
          showTitle: false,
          enableUrlBarHiding: false,
          modalPresentationStyle: 'fullScreen',
          enableBarCollapsing: false
        });
      } else {
        Linking.openURL(url);
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };
  const getSearchTrend = async () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then((location) => {
        setLo(location);
        // console.log("=======" + JSON.stringify(location));
        setLo({
          latitude: location?.longitude,
          longitude: location?.longitude
        })
        AxiosFetcher({
          method: 'GET',
          url:
            'property/findNearest?latitude=' +
            location.latitude +
            '&longtitude=' +
            location.longitude,
        }).then((val) => {
          // console.log(JSON.stringify(val));
        });
      })
      .catch((error) => {
        const { code, message } = error;
        console.warn(code, message);
      });
  };
  const renderBanner = () => {
    return (
      <View style={{ height: ScreenHeight * 0.25 }}>
        <Swiper
          autoplay
          autoplayTimeout={5}
          showsPagination
          scrollEnabled
          loop
          paginationStyle={containerStyle.paginationStyle}>
          {HOME_BANNERS.map((item, index) => {
            return (
              <FastImage
                source={HOME_BANNERS[index].imgUrl}
                style={styles.slide1}
                resizeMode="cover"
              />
            );
          })}
        </Swiper>
      </View>
    );
  };
  const renderBannerClient = () => {
    return (
      <View style={{ height: ScreenHeight * 0.12, width: '92%' }}>
        <ScrollView
          // autoplay
          // autoplayTimeout={5}
          // showsPagination={false}
          // scrollEnabled
          // loop
          // paginationStyle={containerStyle.paginationStyle}
          horizontal
        >
          {HOME_BANNERS_CLIENTS.map((item, index) => {
            return (
              <View style={{ margin: 5, }}>

                <FastImage
                  source={HOME_BANNERS_CLIENTS[index].imgUrl}
                  style={[styles.slide1, { height: ScreenHeight * 0.1, borderRadius: 8, width: ScreenWidth * 0.8 }]}
                  resizeMode="cover"
                >
                  <View style={[{ backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 6, padding: 5 }, containerStyle.shadow]}>
                    {/* <TextNormal text={item?.text} style={{ color: 'white', zIndex: 100, marginTop: 20, alignSelf: 'center' }} /> */}
                  </View>
                </FastImage>
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  };
  const renderSearch = () => {
    return (
      <View style={styles.search}>
        <TextInputFlatLeftIconTouchable
          keyboardType="default"
          props={props}
          hasLeftIcon
          ico={icons.IC_LOCATION}
          onSubmitEditing={() => {
            NavigationService.navigate(ScreenNames.PropertyListScreen, {
              key: t('explorer.restaurant'),
              type: "PROPERTY"
            })
          }}
          placeHolder={t('explorer.search')}
          textInputStyle={styles.fieldEmailPhone}
        />
      </View>
    );
  };
  const renderBtns = () => {
    return (
      <View style={[containerStyle.shadow, { borderRadius: 20 }]}>
        <View style={[styles.banner, { paddingTop: 20 }]}>
          {BTNS?.map((item) => {
            return (
              <TouchableOpacity style={styles.button} onPress={item?.onPress}>
                <FastImage
                  source={item?.icon}
                  style={{ width: 40, height: 40, borderRadius: 20 }}
                />
                <TextNormal
                  text={item?.title}
                  numberOfLines={1}
                  style={styles.buttonText}
                />
              </TouchableOpacity>
            );
          })}
        </View>
        <View
          style={[
            styles.banner,
          ]}>
          {BTNS2?.map((item) => {
            return (
              <TouchableOpacity style={styles.button} onPress={item?.onPress ? item?.onPress : () => tryOpenIAP(item?.link)}>
                <FastImage
                  source={item?.icon}
                  style={{ width: 40, height: 40, borderRadius: 20 }}
                />
                <TextNormal
                  text={item?.title}
                  numberOfLines={2}
                  style={styles.buttonText}
                />
              </TouchableOpacity>
            );
          })}
        </View>
        <View
          style={[
            styles.banner,
            // { borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
          ]}>
          {BTNS3?.map((item) => {
            return (
              <TouchableOpacity
                style={[styles.button]}
                onPress={() => item?.onPress()}>
                <View style={[styles.btn2, { backgroundColor: item?.color }]}>
                  <FastImage
                    source={item?.icon}
                    style={{ width: 40, height: 40, borderRadius: 20 }}
                  />
                </View>
                <TextNormal
                  text={item?.title}
                  numberOfLines={5}
                  style={styles.buttonText}
                />
              </TouchableOpacity>
            );
          })}
        </View>
        <View
          style={[
            styles.banner,
            { borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
          ]}>
          {BTNS4?.map((item) => {
            return (
              <TouchableOpacity
                style={[styles.button]}
                onPress={() => item?.onPress()}>
                <View style={[styles.btn2, { backgroundColor: item?.color }]}>
                  <FastImage
                    source={item?.icon}
                    style={{ width: 40, height: 40, borderRadius: 20 }}
                  />
                </View>
                <TextNormal
                  text={item?.title}
                  numberOfLines={5}
                  style={styles.buttonText}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };
  console.log("======" + marker.length);
  return useObserver(() => (
    <View style={[containerStyle.defaultBackground]}>
      <StatusBar barStyle={colorsApp.statusBar} />
      <ScrollView contentContainerStyle={[styles.mainContainer]} style={{ paddingBottom: ScreenHeight / 2 }}>
        {renderBanner()}
        {renderSearch()}
        {renderBtns()}
        {renderBannerClient()}
        {/* <FastImage
          source={images.map}
          style={[styles.slide1, { height: ScreenHeight * 0.3, width: '90%', margin: 20, borderRadius: 10 }]}
          imageStyle={{ borderRadius: 10 }}
          resizeMode="cover"
        ></FastImage> */}
        <View style={{ height: ScreenHeight / 4, width: ScreenWidth, padding: 20, borderRadius: 10, }}>
          {/* <View style={{
            ...StyleSheet.absoluteFillObject,
            height: 400,
            width: 400,
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}> */}
          {lo?.longitude && marker?.length > 0 && <MapView
            // showsUserLocation={true}
            animateToRegion={true}
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={{ height: ScreenHeight / 4, width: ScreenWidth - 40, borderRadius: 20, }}
            region={{
              latitude: lo?.latitude,
              longitude: lo?.longitude,
              latitudeDelta: 0.4,
              longitudeDelta: 0.5,
            }}
            // onRegionChange={(region ) => {
            //   setLo(region)
            // }}
            // initialRegion={{
            //   latitude: lo?.latitude,
            //   longitude: lo?.longitude,
            // }}
            // coordinate={{
            //   latitude: lo?.latitude,
            //   longitude: lo?.longitude
            // }}
            scrollEnabled={true}
            zoomEnabled={true}
          >
            {/* <Marker
                coordinate={{
                  latitude: lo?.latitude,
                  longitude: lo?.longitude
                }}

                title={t('location.me')}
                draggable /> */}
            {marker?.slice()?.map(item => {
              console.log("23232" + item);
              return (
                <Marker
                  coordinate={{
                    latitude: item?.latitude,
                    longitude: item?.longitude
                  }}
                  onPress={() => {
                    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
                    const latLng = `${item.latitude},${item.longitude}`;
                    const label = 'Custom Label';
                    const url = Platform.select({
                      ios: `${scheme}${label}@${latLng}`,
                      android: `${scheme}${latLng}(${label})`
                    });
                    Linking.openURL(url);
                  }}
                  title={'🕍'}
                  draggable />
              )
            })}
          </MapView>}
        </View>
        <View style={{ width: '100%', marginLeft: 35, marginTop: 20 }}>
          {/* <TextNormal
            text={t('explorer.trend')}
            style={containerStyle.textHeaderSmall}
          /> */}
          {/* {renderSearchTrend()} */}
        </View>
      </ScrollView>
    </View>
  ));
};

export default withTheme(ExploreScreen);
