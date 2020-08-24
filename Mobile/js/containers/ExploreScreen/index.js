/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  StatusBar,
  View,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {styles} from './style';
import {withTheme} from 'react-native-paper';
import {containerStyle} from '../../themes/styles';
import {useTranslation} from 'react-i18next';
import {useStores} from '../../store/useStore';
import Swiper from 'react-native-swiper';
import GetLocation from 'react-native-get-location';
import {images} from '../../../assets';
import {Linking} from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import FastImage from 'react-native-fast-image';
import TextInputFlatLeftIconTouchable from '../../shared/components/TextInput/TextInputFlatLeftIconTouchable';
import {ScreenHeight, ScreenWidth} from '../../shared/utils/dimension/Divices';
import TextNormal from '../../shared/components/Text/TextNormal';
import icons from '../../shared/utils/icons/icons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import {colors} from '../../shared/utils/colors/colors';
import AxiosFetcher from '../../api/AxiosFetch';
import {NavigationService} from '../../navigation';
import {ScreenNames} from '../../route/ScreenNames';
import IALocalStorage from '../../shared/utils/storage/IALocalStorage';
import { ToastHelper } from '../../shared/components/ToastHelper';

const HOME_BANNERS = [
  {imgUrl: images.home1},
  {imgUrl: images.home2},
  {imgUrl: images.home3},
  {imgUrl: images.home4},
  {imgUrl: images.home5},
];

const ExploreScreen = (props) => {
  const {colorsApp} = props.theme;
  const {t} = useTranslation();
  const {userStore} = useStores();
  const [trends, setTrends] = useState([]);

  const BTNS = [
    {
      title: t('explorer.hurry'),
      icon: images.hurry,
      onPress: () =>
        NavigationService.navigate(ScreenNames.ListProductScreen, {
          key: t('explorer.hurry'),
        }),
    },
    {title: t('explorer.nearby'), icon: images.nearby},
    {title: t('explorer.ownerOnsite'), icon: images.noowner},
    {title: t('explorer.yourPlaces'), icon: images.space},
  ];
  const BTNS2 = [
    {
      title: t('explorer.facebook'),
      icon: images.hurry,
      link: 'https://www.facebook.com/dappdtechnology/',
      color: colors.white,
      iconName: 'facebook',
      iconColor: colors.blue,
    },
    {
      title: t('explorer.dMark'),
      icon: images.nearby,
      link: 'https://dmark.shop',
      color: 'green',
      iconName: 'cloud-drizzle',
      iconColor: colors.whiteBackground,
    },
    {
      title: t('explorer.dShare'),
      icon: images.noowner,
      link: 'https://dtechno.tech',
      color: colors.blue_dodger,
      iconName: 'chrome',
      iconColor: colors.whiteBackground,
    },
    {
      title: t('explorer.dCar'),
      icon: images.space,
      link: 'http://cardtechno.store',
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
    props?.navigation.addListener('willFocus', () => {
      getSearchTrend();
      getProfile();
    });
  }, []);
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
        const result = await InAppBrowser.open(url, {
          // iOS Properties
          dismissButtonStyle: 'cancel',
          preferredBarTintColor: '#453AA4',
          preferredControlTintColor: 'white',
          readerMode: false,
          // animated: true,
          modalPresentationStyle: 'fullScreen',
          enableBarCollapsing: false,
          // Android Properties
          showTitle: true,
          toolbarColor: '#6200EE',
          secondaryToolbarColor: 'black',
          enableUrlBarHiding: true,
          enableDefaultShare: true,
          forceCloseOnRedirection: false,
          // Specify full animation resource identifier(package:anim/name)
          // or only resource name(in case of animation bundled with app).
          animations: {},
          headers: {},
        });
        // Alert.alert(JSON.stringify(result));
      } else {
        Linking.openURL(url);
      }
    } catch (error) {
      // Alert.alert(error.message);
    }
  };
  const getSearchTrend = async () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then((location) => {
        AxiosFetcher({
          method: 'GET',
          url:
            'property/findNearest?latitude=' +
            location.latitude +
            '&longtitude=' +
            location.longitude,
        }).then((val) => {
          console.log(JSON.stringify(val));
        });
      })
      .catch((error) => {
        const {code, message} = error;
        console.warn(code, message);
      });
  };
  const renderBanner = () => {
    return (
      <View style={{height: ScreenHeight * 0.25}}>
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
  const renderSearch = () => {
    return (
      <View style={styles.search}>
        <TextInputFlatLeftIconTouchable
          keyboardType="default"
          props={props}
          hasLeftIcon
          ico={icons.IC_LOCATION}
          placeHolder={t('explorer.search')}
          textInputStyle={styles.fieldEmailPhone}
        />
      </View>
    );
  };
  const renderBtns = () => {
    return (
      <View style={[containerStyle.shadow, {borderRadius: 20}]}>
        <View style={[styles.banner, {paddingTop: 20}]}>
          {BTNS?.map((item) => {
            return (
              <TouchableOpacity style={styles.button} onPress={item?.onPress}>
                <FastImage
                  source={item?.icon}
                  style={{width: 40, height: 40}}
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
            {borderBottomLeftRadius: 20, borderBottomRightRadius: 20},
          ]}>
          {BTNS2?.map((item) => {
            return (
              <TouchableOpacity
                style={[styles.button]}
                onPress={() => tryOpenIAP(item?.link)}>
                <View style={[styles.btn2, {backgroundColor: item?.color}]}>
                  <Feather
                    name={item?.iconName}
                    color={item?.iconColor}
                    size={20}
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

  const renderSearchTrend = () => {
    return (
      <View style={styles.trendContainer}>
        <ImageBackground
          source={{uri: MOCK[0].photo[0]}}
          imageStyle={{borderRadius: 20}}
          style={styles.img1}>
          <View style={styles.shadownImg1}>
            <TextNormal
              text={MOCK[0].address}
              style={[containerStyle.textWhite, containerStyle.textHeaderSmall]}
            />
          </View>
        </ImageBackground>
        <View style={{flex: 2, marginLeft: 10}}>
          <ImageBackground
            source={{uri: MOCK[1].photo[0]}}
            imageStyle={{borderRadius: 20}}
            style={styles.img2}>
            <View style={styles.shadowImg2}>
              <TextNormal
                text={MOCK[1].address}
                style={[
                  containerStyle.textWhite,
                  containerStyle.textHeaderSmall,
                ]}
              />
            </View>
          </ImageBackground>
          <ImageBackground
            imageStyle={{borderRadius: 20}}
            source={{uri: MOCK[2].photo[0]}}
            style={styles.img3}>
            <View style={styles.shadowImg3}>
              <TextNormal
                text={MOCK[2].address}
                style={[
                  containerStyle.textWhite,
                  containerStyle.textHeaderSmall,
                ]}
              />
            </View>
          </ImageBackground>
        </View>
      </View>
    );
  };
  return (
    <View style={[containerStyle.defaultBackground]}>
      <StatusBar barStyle={colorsApp.statusBar} />
      <ScrollView contentContainerStyle={[styles.mainContainer]} style={{}}>
        {renderBanner()}
        {renderSearch()}
        {renderBtns()}
        <View style={{width: '100%', marginLeft: 35, marginTop: 20}}>
          <TextNormal
            text={t('explorer.trend')}
            style={containerStyle.textHeaderSmall}
          />
          {renderSearchTrend()}
        </View>
      </ScrollView>
    </View>
  );
};

export default withTheme(ExploreScreen);
