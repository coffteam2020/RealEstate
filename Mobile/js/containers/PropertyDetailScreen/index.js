import {useObserver} from 'mobx-react';
import React, {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Button,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  View,
  FlatList,
  Dimensions,
} from 'react-native';
import {List, ListItem} from 'react-native-elements';
import {withTheme} from 'react-native-paper';
import {images} from '../../../assets';
import {NavigationService} from '../../navigation';
import {ScreenNames} from '../../route/ScreenNames';
import TextNormal from '../../shared/components/Text/TextNormal';
import {useStores} from '../../store/useStore';
import {containerStyle} from '../../themes/styles';
import * as Animatable from 'react-native-animatable';
import TrackPlayer from 'react-native-track-player';
import {styles} from './style';
import {firebase} from '@react-native-firebase/messaging';
import AxiosFetcher from '../../api/AxiosFetch';
import IALocalStorage from '../../shared/utils/storage/IALocalStorage';
import Loading from '../../shared/components/Loading';
import {ToastHelper} from '../../shared/components/ToastHelper';
import Constant from '../../shared/utils/constant/Constant';
import HeaderFull from '../../shared/components/Header/HeaderFull';
import {colors} from '../../shared/utils/colors/colors';
import FastImage from 'react-native-fast-image';
import {ScreenWidth, ScreenHeight} from '../../shared/utils/dimension/Divices';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment'
import {SPACINGS, FONTSIZES, RADIUS} from '../../themes';
import { FirebaseService } from '../../api/FirebaseService';
import Swiper from 'react-native-swiper';
import GradientButton from '../../shared/components/Buttons/GradientButton';
import { constants } from 'buffer';


const ListUltilities = [
  {label: 'Internet', value: 'Internet', icon: 'wifi'},
  {label: 'Water', value: 'Water', icon: 'water'},
  {label: 'Light', value: 'Light', icon: 'lightbulb-on'},
  {label: 'Parking', value: 'Parking', icon: 'car'},
  {label: 'TV', value: 'TV', icon: 'television'},
  {label: 'Air conditioning', value: 'AirConditioning', icon: 'air-conditioner'},
  {label: 'Washing', value: 'Washing', icon: 'washing-machine'},
  {label: 'Bed', value: 'Bed', icon: 'bed-empty'},
  {label: 'Security', value: 'Security', icon: 'account-cowboy-hat'},
  {label: 'Fridge', value: 'Fridge', icon: 'fridge'},
  {label: 'WC', value: 'WC', icon: 'toilet'},
  {label: 'Heater Water', value: 'HeaterWater', icon: 'water-pump'},
];


const PropertyDetailScreen = (props) => {
  const {colorsApp} = props.theme;
  const {t} = useTranslation();
  const {userStore} = useStores();
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const property = props.navigation.state.params.data || {};

  useEffect(() => {
    props?.navigation.addListener('willFocus', () => {
      getProfile();
    });
    getProfile();
  }, []);

  const getProfile = async () => {
    let userInfo = await IALocalStorage.getDetailUserInfo();
    setUserInfo(userInfo);
  };


  const renderDetail = () => {
    return (
      <View
        style={[
          containerStyle.center,
          containerStyle.defaultMarginBottom,
          containerStyle.shadow,
          {
            width: ScreenWidth,
          },
        ]}>
        <View
          style={[
            styles.detailContentWrapper,
            styles.detailContentMarginTopBottom
          ]}>
          <TextNormal
            style={{fontSize: FONTSIZES.large, margin: SPACINGS.avg}}
            text={property?.projectName}></TextNormal>
          <View style={styles.detailContent}>
            <Ionicons
              name="ios-pricetags"
              size={16}
              color={colors.gray_new}></Ionicons>
            <TextNormal
              style={{
                fontSize: FONTSIZES.avg,
                marginLeft: SPACINGS.small,
                marginRight: SPACINGS.small,
                color: colors.purpleMain,
              }}
              text={'$ ' + property?.priceOrMonthlyRent}></TextNormal>
          </View>
          <View style={styles.detailContent}>
            <Ionicons
              name="location"
              size={16}
              color={colors.gray_new}></Ionicons>
            <TextNormal
              style={{
                marginLeft: SPACINGS.small,
                marginRight: SPACINGS.small,
                color: colors.purpleMain,
              }}
              text={property?.address?.address || 'N/A'}></TextNormal>
          </View>
        </View>

        <View
          style={[
            styles.detailContentMarginTopBottom,
            styles.detailContentWrapper,
          ]}>
          <View
            style={[
              containerStyle.defaultMarginTopSmall,
              // containerStyle.defaultMarginBottom,
              styles.detailContentWrapper,
              {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-around',
              },
            ]}>
            <View style={[containerStyle.centerFlexEnd]}>
              <TextNormal style={styles.fieldHeader} text={t('property.size')}></TextNormal>
              <TextNormal style={styles.fieldValue} text={property?.areaUnit ? property?.areaUnit : 'N/A'}></TextNormal>
            </View>
            <View style={[containerStyle.centerFlexEnd]}>
              <TextNormal style={styles.fieldHeader} text={t('property.deposit')}></TextNormal>
              <TextNormal style={styles.fieldValue} text={property?.bookingAmount || 0}></TextNormal>
            </View>
          </View>
          <View style={{display: 'flex', justifyContent: 'center'}}>
            {property?.amenities && (
              <FlatList
                numColumns={2}
                style={{}}
                contentContainerStyle={{
                  margin: SPACINGS.avg,
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                }}
                data={property?.amenities}
                keyExtractor={(item, index) => index}
                renderItem={({item}) => {
                  let current = ListUltilities.filter(
                    (itm) => itm.value === item,
                  );
                  current = current && current.length > 0 ? current[0] : null;
                  if (null !== current) {
                    return (
                      <View
                        style={{
                          backgroundColor: colors.gray_bg_new,
                          margin: SPACINGS.avg,
                          borderRadius: 40,
                          minWidth: ScreenWidth * 0.3,
                          padding: SPACINGS.small,
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignContent: "center",
                          alignItems: "center"
                        }}>
                        <MaterialCommunityIcons
                          color={colors.purpleMain}
                          name={current.icon}
                          size={24}></MaterialCommunityIcons>
                        <TextNormal
                          style={{
                            color: colors.purpleMain,
                            margin : SPACINGS.small
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
          ]}>
          <TextNormal
            style={{fontSize: FONTSIZES.avg, margin: SPACINGS.avg}}
            text={t('property.postDate')}></TextNormal>
          <View style={styles.detailContent}>
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

        <View
          style={[
            styles.detailContentMarginTopBottom,
            styles.detailContentWrapper,
          ]}>
          <TextNormal
            style={{fontSize: FONTSIZES.avg, margin: SPACINGS.avg, }}
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
                onPress={()=>{
                  console.log(property)
                  NavigationService.navigate(ScreenNames.PropertyScreen, {
                    data: property,
                  });
                }}
                style={styles.buttonEitWrapper}>
                <MaterialCommunityIcons
                  name="file-edit"
                  size={24}
                  color={colors.purpleMain}
                />
                <TextNormal
                  text={t('common.edit')}
                  style={{color: colors.purpleMain}}></TextNormal>
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
                <TextNormal text={t('common.delete')} style={{color: colors.red}}></TextNormal>
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
                ToastHelper.showWarning(
                  'This feature is in progress working. Wait for next version',
                );
              }}
            />
            <GradientButton
              style={styles.nextButton}
              text={t('common.book')}
              oonPress={() => {
                ToastHelper.showWarning(
                  'This feature is in progress working. Wait for next version',
                );
              }}
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
                ToastHelper.showWarning(
                  'This feature is in progress working. Wait for next version',
                );
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
    <View style={{height: ScreenHeight * 0.25}}>
      <Swiper
        autoplay
        autoplayTimeout={5}
        showsPagination
        scrollEnabled
        loop
        paginationStyle={containerStyle.paginationStyle}>
        {property?.photos && property?.photos.length > 0  ? 
          (property?.photos.map((item, index) => {
          return (
            <FastImage
              key={index}
              source={{uri: item}}
              style={styles.slide1}
              resizeMode="cover"
            />
          );
        })) :
        (
          <FastImage
            source={{uri: Constant.MOCKING_DATA.NO_IMG_PLACE_HOLDER}}
            style={styles.slide1}
            resizeMode="cover"
          />
        )
      }
      </Swiper>
    </View>
  );
};

  return useObserver(() => (
    <View style={[containerStyle.default, containerStyle.defaultBackground]}>
      <StatusBar barStyle={colorsApp.statusBar} />
      <SafeAreaView>
        <HeaderFull
          hasButton
          title={'Properties Detail'}
        />
        <ScrollView nestedScrollEnabled contentContainerStyle={styles.content}>
          {renderBanner()}
          {renderDetail()}
          {renderContactButton()}
        </ScrollView>
      </SafeAreaView>
    </View>
  ));
  };
export default withTheme(PropertyDetailScreen);
