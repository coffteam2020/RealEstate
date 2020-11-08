import { useObserver } from 'mobx-react';
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
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
  ActivityIndicator,

} from 'react-native';
import { List, ListItem } from 'react-native-elements';
import Axios from 'axios';
import { withTheme } from 'react-native-paper';
import { images } from '../../../assets';
import { NavigationService } from '../../navigation';
import { ScreenNames } from '../../route/ScreenNames';
import TextNormal from '../../shared/components/Text/TextNormal';
import { useStores } from '../../store/useStore';
import { containerStyle } from '../../themes/styles';
import { getDistance, getPreciseDistance } from 'geolib';
import * as Animatable from 'react-native-animatable';
import TrackPlayer from 'react-native-track-player';
import { styles } from './style';
import { firebase } from '@react-native-firebase/messaging';
import AxiosFetcher from '../../api/AxiosFetch';
import IALocalStorage from '../../shared/utils/storage/IALocalStorage';
import Loading from '../../shared/components/Loading';
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
import Empty from '../../shared/components/Empty';
import GradientButton from '../../shared/components/Buttons/GradientButton';
import CheckBox from '@react-native-community/checkbox';
import RangeSlider from 'rn-range-slider';
import GetLocation from 'react-native-get-location';

const PropertyListScreen = (props) => {
  const { colorsApp } = props.theme;
  const { t } = useTranslation();
  const { userStore } = useStores();
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [properties, setProperties] = useState([]);
  const [selectedUltilities, setSelectedUltilities] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('');
  const [gender, setGender] = useState('ALL');
  const [capacity, setCapacity] = useState(0);
  const [filterValue, setFilterValue] = useState([]);

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [maxPriceInit, setMaxPriceInit] = useState(999);
  const flatListfilter = useRef(FlatList);

  const [mainColor, setMainColor] = useState(colors.purpleMain);
  const [title, setTitle] = useState(t('proper'));

  const filterParams = [
    {
      id: 'PRICE',
      label: t('chat.price'),
    },
    {
      id: 'AMENITIES',
      label: t('chat.Amenities'),
    },
    {
      id: 'ROOMTYPE',
      label: t('chat.Room_Type'),
    },
    {
      id: 'CAPACITY',
      label: t('chat.Capacity'),
    },
    {
      id: 'SORTBY',
      label: t('chat.Sort_By'),
    },
  ];
  const FilterType = {
    PRICE: t('chat.price'),
    AMENITIES: t('chat.Amenities'),
    ROOM_TYPE: t('chat.Room_Type'),
    CAPACITY: t('chat.Capacity'),
    GENDER: t('chat.gender'),
    SORTBY: t('chat.Sort_By'),
  }

  const PropertyTypes = [
    { label: t('chat.All'), value: 'ALL' },
    { label: t('chat.Domitory'), value: 'DOMITIRY' },
    { label: t('chat.Room_for_rent'), value: 'ROOM_FOR_RENT' },
    { label: t('chat.Room_For_Share'), value: 'ROOM_FOR_SHARE' },
    { label: t('chat.House'), value: 'HOUSE' },
    { label: t('chat.Apartment'), value: 'APARTMENT' },
  ];
  const SortByList = [
    { label: t('chat.Recently'), value: 'Recently' },
    { label: t('chat.Lastest'), value: 'Lastest' },
    { label: t('chat.Lowest_to_Highest'), value: 'PRICE_LOW_TO_HIGHT' },
    { label: t('chat.Highest_to_Lowest'), value: 'PRICE_HIGH_TO_LOW' },
    { label: t('chat.Nearest'), value: 'Nearest' },
  ];
  const Genders = [
    { label: 'All', value: 'ALL' },
    { label: 'M', value: 'MALE' },
    { label: 'F', value: 'FEMALE' },
  ];

  const PropertyFors = [
    { label: 'All', value: 'All' },
    { label: 'Sale', value: 'Sale' },
    { label: 'Rent', value: 'Rent' },
  ];
  const [sortBy, setSortBy] = useState(SortByList[0]);
  const [sortByTmp, setSortByTmp] = useState(SortByList[0]);

  const [propertyType, setPropertyType] = useState(PropertyTypes[0]);
  const ListUltilities = [
    { label: 'Internet', value: 'Internet', icon: 'wifi' },
    { label: t('chat.Water'), value: 'Water', icon: 'water' },
    { label: t('chat.Light'), value: 'Light', icon: 'lightbulb-on' },
    { label: t('chat.Parking'), value: 'Parking', icon: 'car' },
    { label: 'TV', value: 'TV', icon: 'television' },
    { label: t('chat.Air_conditioning'), value: 'AirConditioning', icon: 'air-conditioner' },
    { label: t('chat.Washing'), value: 'Washing', icon: 'washing-machine' },
    { label: t('chat.Bed'), value: 'Bed', icon: 'bed-empty' },
    { label: t('chat.Security'), value: 'Security', icon: 'account-cowboy-hat' },
    { label: t('chat.Fridge'), value: 'Fridge', icon: 'fridge' },
    { label: 'WC', value: 'WC', icon: 'toilet' },
    { label: t('chat.Heater_Water'), value: 'HeaterWater', icon: 'water-pump' },
  ];


  const filterSkeleton = {
    gender: [],
    propertyType: [],
    price: [],
    amenities: []
  };



  const type = props.navigation.state.params.type || "PROPERTY";

  useEffect(() => {
    props?.navigation.addListener('willFocus', () => {
      initMainColor();
    });
    initMainColor();
    getPropertyList();
  }, []);

  const initMainColor = () => {
    switch (type) {
      case 'HOTEL':
        setMainColor(colors.pink);
        setTitle(t('property.hotelTitle'));
        break;
      case 'RESTAURANT':
        setMainColor(colors.orange_new);
        setTitle(t('property.restaurantTitle'));
        break;
      case 'CAFE':
        setMainColor(colors.brown);
        setTitle(t('property.cafeTitle'));
        break;
      case 'SNACK':
        setMainColor(colors.green_new);
        setTitle(t('property.snacksTitle'));
        break;
      default:
        setMainColor(colors.purpleMain);
        setTitle(t('property.propertyTitle'));
        break;
    }
  };

  const getPropertyList = async () => {
    setIsLoading(true);
    AxiosFetcher({
      method: 'GET',
      url: '/property/findAllWithPagination/?limit=10000&offset=0&sortBy=id',
      hasToken: true,
    })
      .then((val) => {
        setIsLoading(false);
        if (val?.content !== '') {
          let datas = val?.content || [];
          datas = datas.filter(
            (item) => (!item.type && type === 'PROPERTY') || item.type === type,
          );
          setProperties(datas);
          setTimeout(() => {
            for (let i = 0; i < datas?.length; i++) {
              getProfile(datas[i]?.address, i, datas);
            }
          }, 2500);

          setMaxPriceInit(getMaxPrice(datas));
          setMaxPrice(getMaxPrice(datas));
        } else {
          // ToastHelper.showError(t('account.getInfoErr'));
          setProperties([]);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        setProperties([]);
        // ToastHelper.showError(t('account.getInfoErr'));
      });
  };
  const getProfile = async (address, i, data) => {
    // calculateDistance();
    let userInfo = await IALocalStorage.getDetailUserInfo();
    setUserInfo(userInfo);
    Axios.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent(address) + '&key=AIzaSyB5vqnxvHdaTdgKY1E8AsaBxs_FS9HEiCM').then(val => {
      console.log("=========" + JSON.stringify(val?.data));
      let a = val?.data;
      if (a?.results?.length > 0) {
        console.log(a?.results?.[0]?.geometry?.location);
        if (a.results?.[0]?.geometry?.location) {
          // setLo({
          //   latitude: a.results?.[0]?.geometry?.location?.lat,
          //   longitude: a?.results?.[0]?.geometry?.location?.lng,
          // })
          calculateDistance(a.results?.[0]?.geometry?.location?.lat, a?.results?.[0]?.geometry?.location?.lng, i, data)
        } else {
          setIsLoading(false);
          console.log("dsadsad")
        }
      } else {
        setIsLoading(false);
        console.log("dsadsad1")
      }
    })
  };
  const calculateDistance = async (lat, lon, i, data) => {
    console.log("=============")
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    }).then(async a => {
      console.log(a);
      setIsLoading(false);
      var dis = await getDistance(
        { latitude: a?.latitude, longitude: a?.longitude },
        { latitude: lat, longitude: lon },
      );
      console.log("=========dis" + dis  + ''+i);
      var a = data;
      a[i]['distance'] = `${dis / 1000} km`;
      console.log("=========" + JSON.stringify(a));
      setProperties(a?.slice());
      setIsLoading(false);
    }).catch(e => {
    })

  };


  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator() {
    if (sortBy.value === 'Recently') {
      return (a, b) => descendingComparator(a, b, 'createdOn');
    } else if (sortBy.value === 'Lastest') {
      return (a, b) => -descendingComparator(a, b, 'createdOn');
    } else if (sortBy.value === 'PRICE_LOW_TO_HIGHT') {
      return (a, b) => -descendingComparator(a, b, 'priceOrMonthlyRent');
    } else if (sortBy.value === 'PRICE_HIGH_TO_LOW') {
      return (a, b) => descendingComparator(a, b, 'priceOrMonthlyRent');
    } else return (a, b) => descendingComparator(a, b, 'createdOn');
  }

  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  const getMaxPrice = (listItems) => {
    let maxPrice = 0;
    listItems.forEach(item => {
      if (item.priceOrMonthlyRent && item.priceOrMonthlyRent > maxPrice) {
        maxPrice = item.priceOrMonthlyRent;
      }
    })
    return maxPrice;
  }

  const applyFilterObj = (item) => {

    let cond = true;
    let filteredValue;
    filterValue &&
      filterValue.forEach(param => {
        switch (param.type) {
          case FilterType.PRICE:
            filteredValue = !item["priceOrMonthlyRent"] ? false : (param.min <= item["priceOrMonthlyRent"] && item["priceOrMonthlyRent"] <= param.max);
            cond = cond && filteredValue;
            break;
          case FilterType.AMENITIES:
            filteredValue = false;
            item["amenities"].forEach(itm => {
              if (param?.value.indexOf(itm) !== -1) {
                filteredValue = true;
              }
            });
            cond = cond && filteredValue;
            break;
          case FilterType.ROOM_TYPE:
            filteredValue = !item["propertyType"] ? true : item["propertyType"] === param.value;
            cond = cond && filteredValue;
            break;
        }
      })

    return cond;
  };

  const getFilteredItemsList = () => {
    return [...properties.filter(applyFilterObj)];
  };


  const doSelectUltilities = (ulti) => {
    let current = [...selectedUltilities];
    if (current.indexOf(ulti.value) !== -1) {
      //exist
      current = current.filter(item => item !== ulti.value);
    } else {
      current.push(ulti.value);
    }
    setSelectedUltilities(current);
  }

  const removeFilterValueByType = (type) => {
    let curFilter = [...filterValue];
    curFilter = curFilter.filter((item) => item.type !== type);
    if (type === FilterType.GENDER) {
      setGender(Genders[0].value);
    } else if (type === FilterType.CAPACITY) {
      setCapacity(0);
    } else if (type === FilterType.ROOM_TYPE) {
      setPropertyType(PropertyTypes[0]);
    } else if (type === FilterType.AMENITIES) {
      setSelectedUltilities([]);
    } else if (type === FilterType.PRICE) {
      setMinPrice(0);
      setMaxPrice(99999);
    } else if (type === FilterType.SORTBY) {
      setSortBy(SortByList?.[0]);
      setSortByTmp(SortByList?.[0]);
    }
    setFilterValue(curFilter);
  };

  const resetAllFilterValue = () => {
    setFilterValue([]);
    setGender(Genders[0].value);
    setCapacity(0);
    setSortBy(SortByList?.[0]);
    setPropertyType(PropertyTypes[0])
    setSelectedUltilities([]);
    setMinPrice(0);
    setMaxPrice(99999);
  }

  const renderFilterSelection = (param) => {
    switch (param) {
      case FilterType.PRICE:
        return renderPrice();
      case FilterType.AMENITIES:
        return type !== 'PROPERTY' ? null : renderAmenities();
      case FilterType.ROOM_TYPE:
        return renderRoomType();
      case FilterType.CAPACITY:
        return renderCapacity();
      case FilterType.SORTBY:
        return renderSortBy();
      default:
        return;
    }
  };
  const renderProperties = () => {
    if (properties && properties.length === 0) {
      return <Empty />;
    }
    return (
      <FlatList
        data={stableSort(getFilteredItemsList(), getComparator())}
        scrollEnabled
        style={{
          width: ScreenWidth * 0.9,
          height: '100%',
          marginTop: 10,
        }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          console.log(JSON.stringify(item))
          return (
            <TouchableOpacity
              onPress={() => {
                NavigationService.navigate(ScreenNames.PropertyDetailScreen, {
                  data: item,
                  type: type,
                  mainColor: mainColor
                });
              }}
              style={[
                containerStyle.defaultMarginBottom,

                { borderRadius: 1000, marginBottom: 30 },
              ]}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  width: ScreenWidth * 0.9,
                  borderRadius: RADIUS.default,
                }}>
                <FastImage
                  source={{
                    uri:
                      item.photos && item.photos.length > 0 && item.photos[0] !== ''
                        ? item.photos[0]
                        : Constant.MOCKING_DATA.NO_IMG_PLACE_HOLDER,
                  }}
                  style={{
                    width: ScreenWidth / 4,
                    height: ScreenWidth / 4,
                    borderRadius: RADIUS.default,
                  }}></FastImage>
                <View
                  style={[
                    {
                      display: 'flex',
                      flexDirection: 'column',
                      marginLeft: SPACINGS.avg,
                      marginRight: SPACINGS.avg,
                      flex: 1,
                    },
                  ]}>
                  <View
                    id="header"
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                    }}>

                  </View>
                  <TextNormal style={styles.cardTitle} text={item.projectName}></TextNormal>
                  <TextNormal numberOfLines={2} style={styles.cardContent} text={item.description}></TextNormal>
                  <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    // justifyContent: 'space-between',
                  }}>
                    <Ionicons name="ios-pricetags" size={16} color={colors.gray_new}></Ionicons>
                    <TextNormal style={{ marginLeft: SPACINGS.small, marginRight: SPACINGS.small, color: mainColor }} text={'' + item.priceOrMonthlyRent + ' VND'}></TextNormal>
                  </View>
                  {item?.['distance'] ?
                    <View style={{
                      display: 'flex',
                      flexDirection: 'row',
                      // justifyContent: 'space-between',
                    }}>
                      <Ionicons name="location" size={16} color={colors.gray_new}></Ionicons>
                      <TextNormal style={{ marginLeft: SPACINGS.small, marginRight: SPACINGS.small, color: mainColor }} text={' ' + item?.distance}></TextNormal>
                    </View> :
                    <ActivityIndicator size="small" style={{alignSelf: 'flex-start'}}/>}
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    );
  };




  const renderCapacity = () => {
    return (
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: ScreenWidth,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.whiteBackground,
          marginBottom: SPACINGS.large,
        }}>
        <View
          style={{
            width: ScreenWidth * 0.9,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: SPACINGS.avg,
            marginBottom: SPACINGS.avg,
          }}>
          <TextNormal text={t('property.capacity')} />
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'center',
              backgroundColor: colors.gray,
              borderRadius: 40,
            }}>
            <GradientButton
              onPress={() => setCapacity(capacity > 0 ? capacity - 1 : 0)}
              style={styles.plusButton}
              fromColor={colors.gray}
              toColor={colors.gray}
              textStyle={{ color: mainColor }}
              text={'-'}
            />
            <View
              style={{
                backgroundColor: colors.whiteBackground,
                width: 60,
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'center',
                alignSelf: 'center',
                alignItems: 'center',
                borderRadius: 40,
                height: 50,
              }}>
              <TextNormal
                style={{ backgroundColor: colors.whiteBackground, color: mainColor }}
                text={capacity} ></TextNormal>
            </View>
            <GradientButton
              onPress={() => setCapacity(capacity + 1)}
              style={styles.plusButton}
              fromColor={colors.gray}
              toColor={colors.gray}
              textStyle={{ color: mainColor }}
              text={'+'}
            />
          </View>
        </View>
        <View
          style={{
            width: ScreenWidth,
            width: ScreenWidth * 0.9,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignContent: 'center',
            alignSelf: 'center',
            alignItems: 'center',
            marginTop: SPACINGS.avg,
            marginBottom: SPACINGS.avg,
          }}>
          <TextNormal text={t('property.gender')} />
          <View
            style={{
              display: 'flex',
              width: ScreenWidth * 0.76,
              flexDirection: 'row',
              backgroundColor: colors.gray,
              borderRadius: 40,
              justifyContent: 'space-evenly',
            }}>
            {Genders.map((item, index) => {
              return (
                <GradientButton
                  onPress={() => setGender(item.value)}
                  style={{
                    borderRadius: 40,
                    width: ScreenWidth * 0.25,
                    borderWidth: 1,
                    borderColor: gender === item.value ? mainColor : colors.gray_bg,
                    color: colors.black,
                  }}
                  fromColor={
                    gender === item.value ? colors.whiteBackground : colors.gray
                  }
                  toColor={
                    gender === item.value ? colors.whiteBackground : colors.gray
                  }
                  textStyle={{
                    color: gender === item.value ? mainColor : colors.black,
                  }}
                  text={item.label}
                />
              );
            })}
          </View>
        </View>
        <GradientButton
          style={styles.applyButton}
          onPress={() => {
            let newFilter = [...filterValue];
            newFilter = newFilter.filter(item => (item.type !== FilterType.CAPACITY || item.type !== FilterType.GENDER))
            if (capacity > 0) {
              let filter = { type: FilterType.CAPACITY, value: capacity, label: "Capacity: " + capacity };
              newFilter.push(filter);
            }
            let filter = { type: FilterType.GENDER, value: gender, label: "GENDER: " + gender };
            newFilter.push(filter);
            setFilterValue(newFilter);
            setSelectedFilter('');
          }}
          fromColor={mainColor}
          toColor={mainColor}
          text={t('common.apply')}
        />
      </View>
    );
  };

  const renderSortBy = () => {
    return (
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: ScreenWidth,
          justifyContent: 'center',
          alignItems: "center"
        }}>
        <View style={{ marginBottom: SPACINGS.large, width: ScreenWidth * 0.7 }}>
          {SortByList.map((item, index) => {
            return (
              <View
                key={'sortBy-' + index}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'space-between',
                  margin: SPACINGS.avg,
                }}>
                <TouchableOpacity
                  onPress={() => setSortByTmp(item)}
                  style={{ flex: 1, backgroundColor: colors.ređ }}>
                  <TextNormal text={item.label} />
                </TouchableOpacity>
                <CheckBox
                  disabled={sortByTmp.value === item.value}
                  onCheckColor={mainColor}
                  onTintColor={mainColor}
                  key={index}
                  value={sortByTmp.value === item.value}
                  style={{ height: 20 }}
                  onValueChange={(newValue) => {
                    if (newValue) setSortByTmp(item);
                  }}
                />
              </View>
            );
          })}
        </View>
        <GradientButton
          style={styles.applyButton}
          onPress={() => {
            let newFilter = [...filterValue];
            newFilter = newFilter.filter(item => item.type !== FilterType.SORTBY)
            let filter = { type: FilterType.SORTBY, value: sortByTmp.value, label: t('chat.Sort_By') + sortByTmp.label };
            newFilter.push(filter);
            setFilterValue(newFilter);
            setSelectedFilter('');
            setSortBy(sortByTmp);
          }}
          fromColor={mainColor}
          toColor={mainColor}
          text={t('common.apply')}
        />
      </View>
    );
  }

  const renderRoomType = () => {
    return (
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: ScreenWidth,
          justifyContent: 'center',
          alignItems: "center"
        }}>
        <View style={{ marginBottom: SPACINGS.large, width: ScreenWidth * 0.7 }}>
          {PropertyTypes.map((item, index) => {
            return (
              <View
                key={'sortBy-' + index}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'space-between',
                  margin: SPACINGS.avg,
                }}>
                <TouchableOpacity
                  onPress={() => setPropertyType(item)}
                  style={{ flex: 1, backgroundColor: colors.ređ }}>
                  <TextNormal text={item.label} />
                </TouchableOpacity>
                <CheckBox
                  disabled={propertyType.value === item.value}
                  onCheckColor={mainColor}
                  onTintColor={mainColor}
                  key={index}
                  value={propertyType.value === item.value}
                  style={{ height: 20 }}
                  onValueChange={(newValue) => {
                    if (newValue) setPropertyType(item);
                  }}
                />
              </View>
            );
          })}
        </View>
        <GradientButton
          style={styles.applyButton}
          onPress={() => {
            let newFilter = [...filterValue];
            newFilter = newFilter.filter(item => item.type !== FilterType.ROOM_TYPE)
            let filter = { type: FilterType.ROOM_TYPE, value: propertyType.value, label: 'Room Type: ' + propertyType.label };
            newFilter.push(filter);
            setFilterValue(newFilter);
            setSelectedFilter('');
          }}
          text={t('common.apply')}
          fromColor={mainColor}
          toColor={mainColor}
        />
      </View>
    );
  }

  const renderPrice = () => {
    return (
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: ScreenWidth,
          alignItems: 'center',
          marginBottom: SPACINGS.large,
        }}>
        <View style={{ width: ScreenWidth * 0.9, marginTop: SPACINGS.avg, marginBottom: SPACINGS.avg }}>
          <TextNormal text={'Price range'} />
        </View>
        <View style={{ width: ScreenWidth * 0.9, display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
          <TextNormal style={{ color: mainColor }} text={'Min: ' + minPrice} />
          <TextNormal style={{ color: mainColor }} text={'Max: ' + maxPrice} />
        </View>
        <RangeSlider
          style={{ width: ScreenWidth * 0.8, height: 80 }}
          gravity={'top'}
          initialLowValue={minPrice}
          initialHighValue={maxPrice}
          min={0}
          max={maxPriceInit}
          step={10}
          selectionColor={mainColor}
          labelBackgroundColor={colors.whiteBackground}
          labelBorderColor={mainColor}
          labelTextColor={mainColor}
          blankColor={colors.white}
          onValueChanged={(low, high, fromUser) => {
            setMinPrice(low);
            setMaxPrice(high);
          }}
        />
        <GradientButton
          fromColor={mainColor}
          toColor={mainColor}
          style={[
            styles.applyButton,
            {
              marginBottom: SPACINGS.avg,
            },
          ]}
          onPress={() => {
            let newFilter = [...filterValue];
            newFilter = newFilter.filter((item) => item.type !== FilterType.PRICE);
            let filter = {
              type: FilterType.PRICE,
              min: minPrice,
              max: maxPrice,
              label: minPrice + ' - ' + maxPrice,
            };
            newFilter.push(filter);
            setFilterValue(newFilter);
            setSelectedFilter('');
          }}
          text={t('common.apply')}
        />
      </View>
    );
  };

  const renderAmenities = () => {
    return (
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: ScreenWidth,
          justifyContent: 'center',
          alignItems: "center"
        }}>
        <FlatList
          numColumns={2}
          style={{
            margin: SPACINGS.avg,
            width: ScreenWidth,
          }}
          data={ListUltilities}
          keyExtractor={(item, index) => item.value}
          renderItem={({ item }) => {
            isSelected = selectedUltilities.indexOf(item.value) !== -1;
            return (
              <TouchableOpacity onPress={() => doSelectUltilities(item)}>
                <View
                  style={{
                    minWidth: ScreenWidth * 0.4,
                    backgroundColor: colors.gray_bg_new,
                    margin: SPACINGS.avg,
                    borderRadius: 40,
                    padding: SPACINGS.small,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignItems: 'center',
                  }}>
                  <MaterialCommunityIcons
                    color={isSelected ? mainColor : colors.gray_new}
                    name={item.icon}
                    size={24}></MaterialCommunityIcons>
                  <TextNormal
                    style={{
                      color: isSelected ? mainColor : colors.gray_new,
                    }}
                    text={item.label}></TextNormal>
                </View>
              </TouchableOpacity>
            );
          }}></FlatList>
        <GradientButton
          style={styles.applyButton}
          onPress={() => {
            let newFilter = [...filterValue];
            newFilter = newFilter.filter(item => item.type !== FilterType.AMENITIES);
            let filter = { type: FilterType.AMENITIES, value: [...selectedUltilities], label: 'AMENITIES:...' };
            newFilter.push(filter);
            setFilterValue(newFilter);
            setSelectedFilter('');
          }}
          text={t('common.apply')}
          fromColor={mainColor}
          toColor={mainColor}
        />
      </View>
    );
  }

  const renderFilter = () => {
    return (
      <View>
        <View
          style={[
            {
              width: ScreenWidth,
              backgroundColor: colors.whiteBackground,
              height: 50,
              marginTop: SPACINGS.avg,
              marginBottom: SPACINGS.avg
            },
          ]}>
          <FlatList
            style={{ width: ScreenWidth, height: 50 }}
            horizontal={true}
            ref={flatListfilter}
            showsHorizontalScrollIndicator={false}
            legacyImplementation={false}
            keyExtractor={(item) => item.id}
            data={type === 'PROPERTY' ? filterParams : filterParams?.filter(item => item?.id === 'PRICE' || item?.id === 'SORTBY')}
            renderItem={({ item }) => {
              let isSelected = selectedFilter === item.id;
              if (type === "CAFE" && item.id === "AMENITIES") {
                return null;
              }
              else
                return (
                  <TouchableOpacity
                    onPress={() => {
                      if (isSelected) {
                        setSelectedFilter('');
                      } else {
                        setSelectedFilter(item.id);
                      }

                    }}
                    style={{
                      backgroundColor: colors.whiteBackground,
                      borderRadius: 40,
                      margin: SPACINGS.avg,
                      paddingLeft: SPACINGS.avg,
                      paddingRight: SPACINGS.avg,
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor: isSelected
                        ? mainColor
                        : colors.gray_new,
                    }}>
                    <TextNormal
                      text={item.label}
                      style={{
                        fontSize: 15,
                        color: isSelected ? mainColor : colors.black,
                      }}></TextNormal>
                    <Ionicons
                      name={isSelected ? "chevron-up" : "chevron-down"}
                      size={20}
                      color={colors.gray_new}
                    />
                  </TouchableOpacity>
                );
            }}
          />
        </View>
        {filterValue?.length > 0 && <View
          style={
            {
              width: ScreenWidth,
              backgroundColor: colors.gray_bg,
              height: 50,
              display: 'flex',
              flexDirection: "row",
              alignItems: "center"
            }
          }>
          <MaterialCommunityIcons
            onPress={() => resetAllFilterValue()}
            color={colors.gray_new}
            name={'delete'}
            size={36}></MaterialCommunityIcons>
          <FlatList
            style={{ width: ScreenWidth * 0.85, height: 50 }}
            horizontal={true}
            pagingEnabled={true}
            showsHorizontalScrollIndicator={false}
            legacyImplementation={false}
            keyExtractor={(item) => item.id}
            data={filterValue}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  backgroundColor: colors.whiteBackground,
                  borderRadius: 40,
                  margin: SPACINGS.avg,
                  paddingLeft: SPACINGS.avg,
                  paddingRight: SPACINGS.avg,
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                }}>
                <TextNormal
                  text={item.label}
                  style={{
                    fontSize: FONTSIZES.avg,
                    color: mainColor,
                  }}></TextNormal>
                <Ionicons
                  onPress={() => removeFilterValueByType(item.type)}
                  name="close-circle"
                  size={20}
                  color={colors.gray}
                />
              </TouchableOpacity>
            )}
          />
        </View>}
        <View
          style={[
            {
              width: ScreenWidth,
              backgroundColor: colors.whiteBackground,
            },
          ]}>
          {renderFilterSelection(selectedFilter)}
        </View>
        <View
          style={
            {
              width: ScreenWidth * 0.9,
              backgroundColor: colors.whiteBackground,
              marginTop: SPACINGS.avg,
              marginBottom: SPACINGS.avg,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              alignContent: "center",
              alignSelf: "center",
              justifyContent: "space-between"
            }
          }>
          <TextNormal style={{ fontSize: FONTSIZES.avg }} text={getFilteredItemsList().length + " " + t('chat.result')}></TextNormal>
          <TextNormal style={{ fontSize: FONTSIZES.avg }} text={t('chat.Sort_By') + " " + sortBy.label}></TextNormal>
        </View>
      </View>
    );

  };

  return useObserver(() => (
    <View style={[containerStyle.default, containerStyle.defaultBackground]}>
      <StatusBar barStyle={colorsApp.statusBar} />
      <SafeAreaView>
        <HeaderFull
          hasButton={true}
          title={title}
          onPress={() => {
            NavigationService.navigate(ScreenNames.PropertyScreen, {
              type: type,
              mainColor: mainColor
            });
          }}
          rightIco={<Ionicons name="add" size={20} color={colors.blackInput} />}
        />
        {renderFilter()}
        <ScrollView nestedScrollEnabled contentContainerStyle={styles.content}>
          {renderProperties()}
        </ScrollView>
      </SafeAreaView>
      {isLoading && <Loading />}
    </View>
  ));
};
export default withTheme(PropertyListScreen);
