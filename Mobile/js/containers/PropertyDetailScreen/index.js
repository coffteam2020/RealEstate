import { useObserver } from 'mobx-react';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ScrollView,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  View,
  FlatList,
  Linking,
} from 'react-native';
import { List, ListItem } from 'react-native-elements';
import { withTheme } from 'react-native-paper';
import Axios from 'axios';
import { images } from '../../../assets';
import GetLocation from 'react-native-get-location';
import { NavigationService } from '../../navigation';
import { ScreenNames } from '../../route/ScreenNames';
import { getDistance, getPreciseDistance } from 'geolib';
import TextNormal from '../../shared/components/Text/TextNormal';
import { useStores } from '../../store/useStore';
import { containerStyle } from '../../themes/styles';
import * as Animatable from 'react-native-animatable';
import TrackPlayer from 'react-native-track-player';
import { styles } from './style';
import { firebase } from '@react-native-firebase/messaging';
import AxiosFetcher from '../../api/AxiosFetch';
import IALocalStorage from '../../shared/utils/storage/IALocalStorage';
import Loading from '../../shared/components/Loading';
import Video from 'react-native-video';
import { ToastHelper } from '../../shared/components/ToastHelper';
import Constant from '../../shared/utils/constant/Constant';
import HeaderFull from '../../shared/components/Header/HeaderFull';
import { colors } from '../../shared/utils/colors/colors';
import FastImage from 'react-native-fast-image';
import { ScreenWidth, ScreenHeight } from '../../shared/utils/dimension/Divices';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment'
import { SPACINGS, FONTSIZES, RADIUS } from '../../themes';
import { FirebaseService } from '../../api/FirebaseService';
import Swiper from 'react-native-swiper';
import GradientButton from '../../shared/components/Buttons/GradientButton';
import { constants } from 'buffer';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import ModalConfirm from '../../shared/components/Modal/ModalConfirm';
import { TimeHelper, ENUM_TIME_FORMAT } from '../../shared/utils/helper/timeHelper';
import { LocationView } from '../ChatRoomScreen/LocationView';
var momentTimezone = require('moment-timezone');

const ListUltilities = [
  { label: 'Internet', value: 'Internet', icon: 'wifi' },
  { label: 'Water', value: 'Water', icon: 'water' },
  { label: 'Light', value: 'Light', icon: 'lightbulb-on' },
  { label: 'Parking', value: 'Parking', icon: 'car' },
  { label: 'TV', value: 'TV', icon: 'television' },
  { label: 'Air conditioning', value: 'AirConditioning', icon: 'air-conditioner' },
  { label: 'Washing', value: 'Washing', icon: 'washing-machine' },
  { label: 'Bed', value: 'Bed', icon: 'bed-empty' },
  { label: 'Security', value: 'Security', icon: 'account-cowboy-hat' },
  { label: 'Fridge', value: 'Fridge', icon: 'fridge' },
  { label: 'WC', value: 'WC', icon: 'toilet' },
  { label: 'Heater Water', value: 'HeaterWater', icon: 'water-pump' },
];


const PropertyDetailScreen = (props) => {
  const { colorsApp } = props.theme;
  const { t } = useTranslation();
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showOpenTime, setShowOpenTime] = useState(false);
  const [bookingTime, setBookingTime] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [lo, setLo] = useState({});
  const [dis, setDis] = useState('');
  const property = props?.navigation?.state?.params?.data || {};
  const type = props?.navigation?.state?.params?.type || "PROPERTY";
  const mainColor = props?.navigation?.state?.params?.mainColor || colors.purpleMain;

  console.log(property)
  useEffect(() => {
    props?.navigation.addListener('willFocus', () => {
      getProfile();
    });
    getProfile();
  }, []);

  const getProfile = async () => {
    calculateDistance();
    let userInfo = await IALocalStorage.getDetailUserInfo();
    setUserInfo(userInfo);
    Axios.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent(property?.address) + '&key=AIzaSyB5vqnxvHdaTdgKY1E8AsaBxs_FS9HEiCM').then(val => {
      console.log(JSON.stringify(val?.data));
      let a = val?.data;
      if (a?.results?.length > 0) {
        console.log(a?.results?.[0]?.geometry?.location);
        if (a.results?.[0]?.geometry?.location) {
          setLo({
            latitude: a.results?.[0]?.geometry?.location?.lat,
            longitude: a?.results?.[0]?.geometry?.location?.lng,
          })
          calculateDistance(a.results?.[0]?.geometry?.location?.lat, a?.results?.[0]?.geometry?.location?.lng)
        }
      }
    })
  };
  const calculateDistance = (lat, lon) => {

    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    }).then(a => {
      var dis = getDistance(
        { latitude: a?.latitude, longitude: a?.longitude },
        { latitude: lat, longitude: lon },
      );
      setDis(`${dis/1000} km`)
    }).catch(e => {
      console.log(e);
    })

  };

  const doBooking = () => {
    const data = {
      propertyId: property?.id,
      bookedAt: moment(bookingTime).valueOf(),
      userId: userInfo?.userId,
      timeZoneId: momentTimezone.tz.guess(),
      userId: userInfo.id,
      bookingStatus: "BOOKING",
    };
    console.log(data);


    setIsLoading(true);
    AxiosFetcher({
      method: 'POST',
      url: '/bookingProperty/' + userInfo.id + '/booking',
      hasToken: true,
      data: data
    })
      .then((val) => {
        setIsLoading(false);
        console.log(val);
        ToastHelper.showSuccess('Booking successful , enjoy!  ');
        // NavigationService.goBack();
      })
      .catch((error) => {
        setIsLoading(false);
      });

  };
  
  const renderDetail = () => {
    return (
      <View
        style={[
          containerStyle.center,
          containerStyle.defaultMarginBottom,
          // containerStyle.shadow,
          {
            width: ScreenWidth,
          },
        ]}>
        <View
          style={[
            styles.detailContentWrapper,
            styles.detailContentMarginTopBottom,
            { paddingLeft: 20 }
          ]}>
          <TextNormal
            style={{ fontSize: FONTSIZES.large }}
            text={property?.projectName}></TextNormal>
          <View style={styles.detailContent}>
            <Ionicons
              name="ios-pricetags"
              size={16}
              color={colors.redSocial}></Ionicons>
            <TextNormal
              style={{
                fontSize: FONTSIZES.avg,
                marginLeft: SPACINGS.small,
                marginRight: SPACINGS.small,
                color: mainColor,
              }}
              text={'$ ' + property?.priceOrMonthlyRent}></TextNormal>
          </View>
          <View style={styles.detailContent}>
            <Ionicons
              name="location"
              size={16}
              color={colors.red}></Ionicons>
            <TextNormal
              style={{
                marginLeft: SPACINGS.small,
                marginRight: SPACINGS.small,
                color: mainColor,
              }}
              text={property?.address || 'N/A'}></TextNormal>
          </View>
          {dis !== '' && <View style={styles.detailContent}>
            <Ionicons
              name="airplane-outline"
              size={16}
              color={colors.blue}></Ionicons>
            <TextNormal
              style={{
                marginLeft: SPACINGS.small,
                marginRight: SPACINGS.small,
                color: mainColor,
              }}
              text={`${t('chat.distance')}: ${dis}`}></TextNormal>
          </View>}
        </View>
        <LocationView location={lo} style={{ width: ScreenWidth * 0.9 }} />
        <View
          style={[
            styles.detailContentMarginTopBottom,
            styles.detailContentWrapper,
          ]}>
          <View
            style={[
              styles.detailContentWrapper,
              {
                flexDirection: 'row',
                justifyContent: 'space-between',
              },
            ]}>
            <View style={{ width: '50%', alignContent: 'center', marginLeft: 20 }}>
              <TextNormal style={styles.fieldHeader} text={t('property.size')}></TextNormal>
              <TextNormal style={[styles.fieldValue, { color: mainColor }]} text={property?.areaUnit ? property?.areaUnit : 'N/A'}></TextNormal>
            </View>
            <View style={{ width: '50%', alignContent: 'center', }}>
              <TextNormal style={styles.fieldHeader} text={t('property.deposit')}></TextNormal>
              <TextNormal style={[styles.fieldValue, { color: mainColor }]} text={property?.bookingAmount || 0}></TextNormal>
            </View>
          </View>
          <View style={{ display: 'flex', justifyContent: 'center' }}>
            {type !== "CAFE" && property?.amenities && (
              <FlatList
                numColumns={2}
                style={{}}
                contentContainerStyle={{
                  // margin: SPACINGS.avg,
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                }}
                data={property?.amenities}
                keyExtractor={(item, index) => index}
                renderItem={({ item }) => {
                  let current = ListUltilities.filter(
                    (itm) => itm.value === item,
                  );
                  current = current && current.length > 0 ? current[0] : null;
                  if (null !== current) {
                    return (
                      <View
                        style={{
                          backgroundColor: colors.whiteBackground,
                          marginBottom: 10,
                          borderRadius: 40,
                          marginLeft: 20,
                          minWidth: ScreenWidth * 0.3,
                          padding: SPACINGS.small,
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignContent: "center",
                          alignItems: "center"
                        }}>
                        <MaterialCommunityIcons
                          color={mainColor}
                          name={current.icon}
                          size={24}></MaterialCommunityIcons>
                        <TextNormal
                          style={{
                            color: mainColor,
                            margin: SPACINGS.small
                          }}
                          text={current.label}></TextNormal>
                      </View>
                    );
                  }
                }}></FlatList>
            )}
          </View>
        </View>

        <View
          style={[
            styles.detailContentMarginTopBottom,
            styles.detailContentWrapper,
            { paddingLeft: 20 }
          ]}>
          <TextNormal
            style={{ fontSize: FONTSIZES.avg }}
            text={t('property.postDate')}></TextNormal>
          <View style={[styles.detailContent, { alignItems: 'center' }]}>
            <Ionicons
              name="calendar"
              size={16}
              color={colors.gray_new}></Ionicons>
            <TextNormal
              style={{
                fontSize: FONTSIZES.avg,
                marginLeft: SPACINGS.small,
                marginRight: SPACINGS.small,
                color: mainColor,
              }}
              text={property?.availabilityDate ? (moment(property?.availabilityDate).format("DD / MMM / yyyy")) : 'N/A'}></TextNormal>
          </View>
        </View>

        <View
          style={[
            styles.detailContentMarginTopBottom,
            styles.detailContentWrapper,
            { paddingLeft: 20 }
          ]}>
          <TextNormal
            style={{ fontSize: FONTSIZES.avg }}
            text={t('property.description')}></TextNormal>
          <View style={styles.detailContent}>
            <TextNormal
              style={{
                fontSize: FONTSIZES.avg,
                marginLeft: SPACINGS.small,
                marginRight: SPACINGS.small,
                color: colors.gray_new,
              }}
              numberOfLines={10}
              text={property?.description}></TextNormal>
          </View>
        </View>

      </View>
    );
  };

  const renderBookingInfo = () => {
    return (
      <View
        style={[
          styles.detailContentMarginTopBottom,
          styles.detailContentWrapper,
          { paddingLeft: 20 }
        ]}>
        <TextNormal
          style={{ fontSize: FONTSIZES.avg }}
          text={t('property.postDate')}></TextNormal>
        <View style={[styles.detailContent, { alignItems: 'center' }]}>
          <Ionicons
            name="calendar"
            size={16}
            color={colors.gray_new}></Ionicons>
          <TextNormal
            style={{
              fontSize: FONTSIZES.avg,
              marginLeft: SPACINGS.small,
              marginRight: SPACINGS.small,
              color: colors.purpleMain,
            }}
            text={property?.availabilityDate ? (moment(property?.availabilityDate).format("DD / MMM / yyyy")) : 'N/A'}></TextNormal>
        </View>
      </View>
    );
  }

  const renderContactButton = () => {

    return (
      <View
        style={[
          containerStyle.defaultMarginBottom,
          {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: "space-around",
            alignItems: "center",
            alignContent: "center",
            alignSelf: "center",
            width: ScreenWidth * 0.9
          },
        ]}>

        {userInfo?.userId === property?.userId ? (
          <>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignContent: 'center',
                width: ScreenWidth * 0.9,
                backgroundColor: colors.gray,
                height: 50,
                borderRadius: 40

              }}>
              <TouchableOpacity
                onPress={() => {
                  NavigationService.navigate(ScreenNames.PropertyScreen, {
                    data: property,
                    type: type,
                    mainColor: mainColor
                  });
                }}
                style={styles.buttonEitWrapper}>
                <MaterialCommunityIcons
                  name="file-edit"
                  size={24}
                  color={mainColor}
                />
                <TextNormal
                  text={t('common.edit')}
                  style={{ color: mainColor }}></TextNormal>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  ToastHelper.showWarning(
                    'This feature is in progress working. Wait for next version',
                  );
                }}
                style={styles.buttonDeleteWrapper}>
                <MaterialCommunityIcons
                  name="delete"
                  size={24}
                  color={colors.red}
                />
                <TextNormal text={t('common.delete')} style={{ color: colors.red }}></TextNormal>
              </TouchableOpacity>
            </View>
          </>
        ) : (
            <>
              <GradientButton
                hasIco
                ico={
                  <Ionicons
                    name="chatbox-ellipses"
                    size={24}
                    color={colors.whiteBackground}></Ionicons>
                }
                style={styles.nextButton}
                text={t('common.chat')}
                onPress={() => {
                  NavigationService.navigate(ScreenNames.ChatRoomScreen, {
                    toUserData: {
                      id: property?.userId,
                      name: property?.userName || 'No name',
                      avatar: property?.userAvatar,
                    },
                  });
                }}
              />
              <GradientButton
                hasIco
                ico={
                  <Ionicons
                    name="calendar"
                    size={24}
                    color={colors.whiteBackground}></Ionicons>
                }
                style={styles.nextButton}
                onPress={() => {
                  setShowOpenTime(true);
                  // ToastHelper.showWarning(
                  //   'This feature is in progress working. Wait for next version',
                  // );
                }}
                text={t('common.book')}
              />
              <GradientButton
                hasIco
                ico={
                  <Ionicons
                    name="call"
                    size={24}
                    color={colors.whiteBackground}></Ionicons>
                }
                style={styles.nextButton}
                onPress={() => {
                  if (property?.phoneContact) {
                    // Linking.openURL(`tel:${property?.phoneContact}`);
                    let phoneNumber = `tel:${property?.phoneContact}`;
                    if (Platform.OS !== 'android') {
                      phoneNumber = `telprompt:${property?.phoneContact}`;
                    }
                    Linking.openURL(phoneNumber);
                  }
                }}
                text={t('common.call')}
              />
            </>
          )}
      </View>
    );
  }

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
          {property?.photos && property?.photos.length > 0 ?
            (property?.photos.map((item, index) => {
              return (
                <FastImage
                  key={index}
                  source={{ uri: item }}
                  style={styles.slide1}
                  resizeMode="cover"
                />
              );
            })) :
            (
              <FastImage
                source={{ uri: Constant.MOCKING_DATA.NO_IMG_PLACE_HOLDER }}
                style={styles.slide1}
                resizeMode="cover"
              />
            )
          }
        </Swiper>
      </View>
    );
  };

  const reSelectTimeBooking = () => {
    setShowOpenTime(true);
    setShowModal(false);
  }

  const renderBooking = () => {
    let title = "Confirmation";
    let subTitle = "Do you want to booking at: ";

    return (
      <>
        {showOpenTime && (
          <DateTimePickerModal
            isVisible={showOpenTime}
            mode="datetime"
            onConfirm={(date) => {
              setBookingTime(moment(date).toDate());
              setShowOpenTime(false);
              setShowModal(true);
            }}
            minimumDate={new Date()}
            date={bookingTime}
            onCancel={() => setShowOpenTime(false)}
            cancelTextIOS={t('common.cancel')}
            confirmTextIOS={t('common.confirm')}
            headerTextIOS={t('common.pickATime')}
          />
        )}
        {showModal ? (
          <ModalConfirm
            isVisible={showModal}
            title={title}
            subTitle={subTitle}
            secondSubTitle={moment(bookingTime).format(ENUM_TIME_FORMAT.FULL)}
            onPress={() => {
              doBooking();
              setShowModal(false);
            }}
            hasIco
            ico={<MaterialCommunityIcons name={'calendar-edit'} color={mainColor} size={24}></MaterialCommunityIcons>}
            icoPress={reSelectTimeBooking}
            onClose={() => {
              setShowModal(false);
            }}
          />
        ) : null}
      </>
    );
  };

  return useObserver(() => (
    <View style={[containerStyle.default, containerStyle.defaultBackground]}>
      <StatusBar barStyle={colorsApp.statusBar} />
      <SafeAreaView>
        <HeaderFull
          hasButton
          title={''}
        />
        <ScrollView nestedScrollEnabled contentContainerStyle={styles.content}>
          {renderBanner()}
          {renderDetail()}
          {renderContactButton()}
          {renderBooking()}
        </ScrollView>
      </SafeAreaView>
    </View>
  ));
};
export default withTheme(PropertyDetailScreen);
