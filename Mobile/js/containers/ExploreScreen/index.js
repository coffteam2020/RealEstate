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
import FastImage from 'react-native-fast-image';
import TextInputFlatLeftIconTouchable from '../../shared/components/TextInput/TextInputFlatLeftIconTouchable';
import {ScreenHeight, ScreenWidth} from '../../shared/utils/dimension/Divices';
import TextNormal from '../../shared/components/Text/TextNormal';
import icons from '../../shared/utils/icons/icons';
import {colors} from '../../shared/utils/colors/colors';
import AxiosFetcher from '../../api/AxiosFetch';

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
    {title: t('explorer.hurry'), icon: images.hurry},
    {title: t('explorer.nearby'), icon: images.nearby},
    {title: t('explorer.ownerOnsite'), icon: images.noowner},
    {title: t('explorer.yourPlaces'), icon: images.space},
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
    props?.navigation.addListener('willFocus', () => {
      getSearchTrend();
    });
  }, []);
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
      <View style={[styles.banner, containerStyle.shadow]}>
        {BTNS?.map((item) => {
          return (
            <TouchableOpacity style={styles.button}>
              <FastImage source={item?.icon} style={{width: 40, height: 40}} />
              <TextNormal
                text={item?.title}
                numberOfLines={5}
                style={styles.buttonText}
              />
            </TouchableOpacity>
          );
        })}
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
