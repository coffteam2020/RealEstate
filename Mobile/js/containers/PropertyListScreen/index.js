import {useObserver} from 'mobx-react';
import React, {useState, useEffect, useRef} from 'react';
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
import Empty from '../../shared/components/Empty';
import GradientButton from '../../shared/components/Buttons/GradientButton';
import CheckBox from '@react-native-community/checkbox';
import RangeSlider from 'rn-range-slider';

const filterParams = [
  {
    id: 'PRICE',
    label: 'Price',
  },
  {
    id: 'AMENITIES',
    label: 'Amenities',
  },
  {
    id: 'ROOMTYPE',
    label: 'Room Type',
  },
  {
    id: 'CAPACITY',
    label: 'Capacity',
  },
  {
    id: 'SORTBY',
    label: 'Sort By',
  },
];
const FilterType = {
  PRICE : 'PRICE',
  AMENITIES: 'AMENITIES',
  ROOM_TYPE: 'ROOMTYPE',
  CAPACITY: 'CAPACITY',
  GENDER: 'GENDER',
  SORTBY: 'SORTBY'
}

const PropertyTypes = [
  {label: 'All', value: 'ALL'},
  {label: 'Domitory', value: 'DOMITIRY'},
  {label: 'Room for rent', value: 'ROOM_FOR_RENT'},
  {label: 'Room For Share', value: 'ROOM_FOR_SHARE'},
  {label: 'House', value: 'HOUSE'},
  {label: 'Apartment', value: 'APARTMENT'},
];
const SortByList = [
  {label: 'Recently', value: 'Recently'},
  {label: 'Lastest', value: 'Lastest'},
  {label: 'Lowest to Highest', value: 'PRICE_LOW_TO_HIGHT'},
  {label: 'Highest to Lowest', value: 'PRICE_HIGH_TO_LOW'},
  {label: 'Nearest', value: 'Nearest'},
];
const Genders = [
  {label: 'All', value: 'ALL'},
  {label: 'Male', value: 'MALE'},
  {label: 'Female', value: 'FEMALE'},
];

const PropertyFors = [
  {label: 'All', value: 'All'},
  {label: 'Sale', value: 'Sale'},
  {label: 'Rent', value: 'Rent'},
];

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


const filterSkeleton = {
  gender: [],
  propertyType: [],
  price: [],
  amenities: []
};


const PropertyListScreen = (props) => {
  const {colorsApp} = props.theme;
  const {t} = useTranslation();
  const {userStore} = useStores();
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [properties, setProperties] = useState([]);
  const [selectedUltilities, setSelectedUltilities] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('');
  const [gender, setGender] = useState('ALL');
  const [capacity, setCapacity] = useState(0);
  const [filterValue, setFilterValue] = useState([]);
  const [sortBy, setSortBy] = useState(SortByList[0]);
  const [sortByTmp, setSortByTmp] = useState(SortByList[0]);

  const [propertyType, setPropertyType] = useState(PropertyTypes[0]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [maxPriceInit, setMaxPriceInit] = useState(999);
  const flatListfilter = useRef(FlatList);

  useEffect(() => {
    props?.navigation.addListener('willFocus', () => {
      getPropertyList();
    });
    getPropertyList();
  }, []);

  const getPropertyList = async () => {
    setIsLoading(true);
    AxiosFetcher({
      method: 'GET',
      url: '/property/findAllWithPagination/?limit=1000&offset=0&sortBy=id',
      hasToken: true,
    })
      .then((val) => {
        setIsLoading(false);
        if (val?.content !== '') {
          setProperties(val.content);
          setMaxPriceInit(getMaxPrice(val.content));
          setMaxPrice(getMaxPrice(val.content))
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
    listItems.forEach(item =>{
      if(item.priceOrMonthlyRent && item.priceOrMonthlyRent > maxPrice){
        maxPrice = item.priceOrMonthlyRent;
      }
    })
    return maxPrice;
  }

  const applyFilterObj = (item) => {
    
    let cond = true;
    let filteredValue;
    filterValue &&
      filterValue.forEach(param =>{
        switch(param.type){
          case FilterType.PRICE:
            filteredValue = !item["priceOrMonthlyRent"] ? false : (param.min <= item["priceOrMonthlyRent"] && item["priceOrMonthlyRent"] <= param.max);
            cond = cond && filteredValue;
            break;
          case FilterType.AMENITIES:
            filteredValue = false;
            item["amenities"].forEach(itm =>{
              if(param?.value.indexOf(itm) !== -1){
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
    if(current.indexOf(ulti.value) !== -1){
      //exist
      current = current.filter(item => item !== ulti.value);
    }else{
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
    }else if (type === FilterType.SORTBY) {
      setSortBy(SortByList[0]);
      setSortByTmp(SortByList[0]);
    }
    setFilterValue(curFilter);
  };

  const resetAllFilterValue = () =>{
    setFilterValue([]);
    setGender(Genders[0].value);
    setCapacity(0);
    setSortBy(SortByList[0]);
    setPropertyType(PropertyTypes[0])
    setPropertyTypeTmp(PropertyTypes[0])
    setSelectedUltilities([]);
    setMinPrice(0);
    setMaxPrice(99999);
  }

  const renderFilterSelection = (param) => {
    switch (param) {
      case FilterType.PRICE:
        return renderPrice();
      case FilterType.AMENITIES:
        return renderAmenities();
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
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              onPress={() => {
                NavigationService.navigate(ScreenNames.PropertyDetailScreen, {
                  data: item,
                });
              }}
              style={[
                containerStyle.defaultMarginBottom,
                {borderRadius: 1000},
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
                      item.photos && item.photos.length > 0
                        ? item.photos[0]
                        : Constant.MOCKING_DATA.NO_IMG_PLACE_HOLDER,
                  }}
                  style={{
                    width: ScreenWidth / 4,
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
                    <View style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                        <Ionicons name="ios-pricetags" size={16} color={colors.gray_new}></Ionicons>
                        <TextNormal style={{marginLeft: SPACINGS.small, marginRight: SPACINGS.small, color: colors.purpleMain}} text={'$ ' + item.priceOrMonthlyRent}></TextNormal>
                    </View>
                  </View>
                    <TextNormal style={styles.cardTitle} text={item.projectName}></TextNormal>
                    <TextNormal numberOfLines={2} style={styles.cardContent} text={item.description}></TextNormal>
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
              textStyle={{color: colors.purpleMain}}
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
                style={{backgroundColor: colors.whiteBackground}}
                text={capacity}></TextNormal>
            </View>
            <GradientButton
              onPress={() => setCapacity(capacity + 1)}
              style={styles.plusButton}
              fromColor={colors.gray}
              toColor={colors.gray}
              textStyle={{color: colors.purpleMain}}
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
                  style={
                    gender === item.value
                      ? styles.selectedButton
                      : styles.genderButton
                  }
                  fromColor={
                    gender === item.value ? colors.whiteBackground : colors.gray
                  }
                  toColor={
                    gender === item.value ? colors.whiteBackground : colors.gray
                  }
                  textStyle={{
                    color: gender === item.value ? colors.purpleMain : colors.black,
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
            newFilter = newFilter.filter(item => ( item.type !== FilterType.CAPACITY || item.type !== FilterType.GENDER))
            if(capacity > 0){
              let filter = { type : FilterType.CAPACITY, value : capacity, label : "Capacity: " + capacity};
              newFilter.push(filter);
            }
            let filter = { type : FilterType.GENDER, value : gender, label : "GENDER: " + gender};
            newFilter.push(filter);
            setFilterValue(newFilter);
            setSelectedFilter('');
          }}
          text={t('common.apply')}
        />
      </View>
    );
  };

  const renderSortBy = () =>{
    return (
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: ScreenWidth,
          justifyContent: 'center',
          alignItems: "center"
        }}>
        <View style={{marginBottom: SPACINGS.large, width: ScreenWidth * 0.7}}>
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
                  style={{flex: 1, backgroundColor: colors.ređ}}>
                  <TextNormal text={item.label} />
                </TouchableOpacity>
                <CheckBox
                  disabled={sortByTmp.value === item.value}
                  onCheckColor={colors.purpleMain}
                  onTintColor={colors.purpleMain}
                  key={index}
                  value={sortByTmp.value  === item.value}
                  style={{height: 20}}
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
            let filter = { type : FilterType.SORTBY, value : sortByTmp.value, label: 'Sort by: ' + sortByTmp.label};
            newFilter.push(filter);
            setFilterValue(newFilter);
            setSelectedFilter('');
            setSortBy(sortByTmp);
          }}
          text={t('common.apply')}
        />
      </View>
    );
  }

  const renderRoomType = () =>{
    return (
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: ScreenWidth,
          justifyContent: 'center',
          alignItems: "center"
        }}>
        <View style={{marginBottom: SPACINGS.large, width: ScreenWidth * 0.7}}>
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
                  style={{flex: 1, backgroundColor: colors.ređ}}>
                  <TextNormal text={item.label} />
                </TouchableOpacity>
                <CheckBox
                  disabled={propertyType.value === item.value}
                  onCheckColor={colors.purpleMain}
                  onTintColor={colors.purpleMain}
                  key={index}
                  value={propertyType.value  === item.value}
                  style={{height: 20}}
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
            let filter = { type : FilterType.ROOM_TYPE, value : propertyType.value, label: 'Room Type: ' + propertyType.label};
            newFilter.push(filter);
            setFilterValue(newFilter);
            setSelectedFilter('');
          }}
          text={t('common.apply')}
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
        <View style={{width: ScreenWidth * 0.9, marginTop: SPACINGS.avg, marginBottom: SPACINGS.avg}}>
          <TextNormal text={'Price range'} />
        </View>
        <View style={{width: ScreenWidth * 0.9, display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
          <TextNormal style={{color: colors.purpleMain}} text={'Min: ' + minPrice} />
          <TextNormal style={{color: colors.purpleMain}} text={'Max: ' + maxPrice} />
        </View>
        <RangeSlider
          style={{width: ScreenWidth * 0.8, height: 80}}
          gravity={'top'}
          initialLowValue={minPrice}
          initialHighValue={maxPrice}
          min={0}
          max={maxPriceInit}
          step={10}
          selectionColor={colors.purpleMain}
          labelBackgroundColor={colors.whiteBackground}
          labelBorderColor={colors.purpleMain}
          labelTextColor={colors.purpleMain}
          blankColor={colors.white}
          onValueChanged={(low, high, fromUser) => {
            setMinPrice(low);
            setMaxPrice(high);
          }}
        />
        <GradientButton
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

  const renderAmenities = () =>{
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
          renderItem={({item}) => {
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
                    color={isSelected ? colors.purpleMain : colors.gray_new}
                    name={item.icon}
                    size={24}></MaterialCommunityIcons>
                  <TextNormal
                    style={{
                      color: isSelected ? colors.purpleMain : colors.gray_new,
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
            newFilter  = newFilter.filter(item => item.type !== FilterType.AMENITIES);
            let filter = {type : FilterType.AMENITIES, value : [...selectedUltilities], label: 'AMENITIES:...'};
            newFilter.push(filter);
            setFilterValue(newFilter);
            setSelectedFilter('');
          }}
          text={t('common.apply')}
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
            style={{width: ScreenWidth, height: 50}}
            horizontal={true}
            ref={flatListfilter}
            showsHorizontalScrollIndicator={false}
            legacyImplementation={false}
            keyExtractor={(item) => item.id}
            data={filterParams}
            renderItem={({item}) => {
              let isSelected = selectedFilter === item.id;
              return (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedFilter(item.id);
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
                      ? colors.purpleMain
                      : colors.gray_new,
                  }}>
                  <TextNormal
                    text={item.label}
                    style={{
                      fontSize: 15,
                      color: isSelected ? colors.purpleMain : colors.black,
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
            style={{width: ScreenWidth * 0.85, height: 50}}
            horizontal={true}
            pagingEnabled={true}
            showsHorizontalScrollIndicator={false}
            legacyImplementation={false}
            keyExtractor={(item) => item.id}
            data={filterValue}
            renderItem={({item}) => (
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
                    color: colors.purpleMain,
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
          <TextNormal style={{fontSize: FONTSIZES.avg}} text={getFilteredItemsList().length + ' results'}></TextNormal>
          <TextNormal style={{fontSize: FONTSIZES.avg}} text={'Sort by: '+ sortBy.label}></TextNormal>
        </View>
      </View>
    );
  
  };

  return useObserver(()=>(
    <View style={[containerStyle.default, containerStyle.defaultBackground]}>
      <StatusBar barStyle={colorsApp.statusBar} />
      <SafeAreaView>
        <HeaderFull
          hasButton={true}
          title={'Properties List'}
          onPress={() => {
            NavigationService.navigate(ScreenNames.PropertyScreen);
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
