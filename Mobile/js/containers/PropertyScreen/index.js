import {useObserver} from 'mobx-react';
import React, {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Button,
  Text,
  Image,
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
import StepIndicator from 'react-native-step-indicator';
import CheckBox from '@react-native-community/checkbox';
import TextInputFlat from '../../shared/components/TextInput/TextInputFlat';
import TextInputFlatWithRightCheckbox from '../../shared/components/TextInput/TextInputFlatWithRightCheckbox';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import GradientButton from '../../shared/components/Buttons/GradientButton';
import GridList from 'react-native-grid-list';
import ImagePicker from 'react-native-image-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import TextInputFlatNew from '../../shared/components/TextInput/TextInputFlatNew';

const labels = ['Infomation', 'Address', 'Utilities', 'Conformation'];
  const customStyles = {
    stepIndicatorSize: 30,
    currentStepIndicatorSize: 40,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: colors.purpleMain,
    stepStrokeWidth: 3,
    separatorStrokeFinishedWidth: 4,
    stepStrokeFinishedColor: colors.purpleMain,
    stepStrokeUnFinishedColor: '#aaaaaa',
    separatorFinishedColor: colors.purpleMain,
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: colors.purpleMain,
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: '#ffffff',
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: colors.purpleMain,
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#aaaaaa',
    labelColor: '#999999',
    labelSize: 13,
    currentStepLabelColor: '#fe7013',
  };
  const RoomTypes = [
    {label: 'Domitory', value: 'DOMITIRY'},
    {label: 'Room for rent', value: 'ROOM_FOR_RENT'},
    {label: 'Room For Share', value: 'ROOM_FOR_SHARE'},
    {label: 'House', value: 'HOUSE'},
    {label: 'Apartment', value: 'APARTMENT'},
  ];
  const Genders = [
    {label: 'All', value: 'ALL'},
    {label: 'Male', value: 'MALE'},
    {label: 'Female', value: 'FEMALE'},
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

  

const PropertyScreen = (props) => {
  const {colorsApp} = props.theme;
  const {t} = useTranslation();
  const {userStore} = useStores();
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [avt, setAvt] = useState('');
  const [roomType, setRoomType] = useState(RoomTypes[0].value);
  const [gender, setGender] = useState(Genders[0].value);
  const [currentPage, setCurrentPage] = useState(3);
  const [parkingAvailable, setParkingAvailable] = useState(false);
  const [property, setProperty] = useState({});
  const [images, setImages] = useState([]);
  const [selectedUltilities, setSelectedUltilities] = useState([]);
  const [showOpenTime, setShowOpenTime] = useState(false);
  const [showCloseTime, setShowCloseTime] = useState(false);
  const [openTime, setOpenTime] = useState(new Date());
  const [closeTime, setCloseTime] = useState(new Date());

  const IMAGE_CONFIG = {
    title: t('imagePicker.name'),
    cancelButtonTitle: t('common.cancel'),
    takePhotoButtonTitle: t('imagePicker.camera'),
    chooseFromLibraryButtonTitle: t('imagePicker.name'),
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

  useEffect(() => {
    props?.navigation.addListener('willFocus', () => {
      getProfile();
    });
    getProfile();
  }, []);
  const getProfile = async () => {
    let userInfo = await IALocalStorage.getDetailUserInfo();
    setIsLoading(true);
    AxiosFetcher({
      method: 'GET',
      url: 'user/' + userInfo?.id,
      hasToken: true,
    })
      .then((val) => {
        console
        if (val?.data !== '') {
          setIsLoading(false);
          userStore.userInfo = val;
          setAvt(val?.avatar);
        } else {
          setIsLoading(false);
          ToastHelper.showError(t('account.getInfoErr'));
        }
      })
      .catch(() => {
        setIsLoading(false);
        ToastHelper.showError(t('account.getInfoErr'));
      });
  };

  const onStepPress = (position) => {
    setCurrentPage(position);
  };
  const onNextStepPress = () => {
    setCurrentPage(currentPage + 1);
  };

  const onRoomTypeChange = (evt, item) => {
    if(!evt){
      setRoomType(RoomTypes[0].value);
    }else{
      setRoomType(item.value);
    }
    
  };

  const rightIco = isLoading ? null : (
    <TextNormal text={t('social.post')}></TextNormal>
  );

  

  const getStepIndicatorIconConfig = ({position, stepStatus}) => {
    const iconConfig = {
      name: 'feed',
      color: stepStatus === 'finished' ? '#ffffff' : colors.purpleMain,
      size: 15,
    };
    if (stepStatus === 'finished') {
      iconConfig.name = 'done';
      return iconConfig;
    }
    switch (position) {
      case 0: {
        iconConfig.name = 'info-outline';
        break;
      }
      case 1: {
        iconConfig.name = 'location-on';
        break;
      }
      case 2: {
        iconConfig.name = 'assessment';
        break;
      }
      case 3: {
        iconConfig.name = 'payment';
        break;
      }
      default: {
        break;
      }
    }
    return iconConfig;
  };

  const renderStepIndicator = (params) => (
    <MaterialIcons {...getStepIndicatorIconConfig(params)} />
  );

  const renderLabel = ({position, label, currentPosition}) => {
    return (
      <Text
        style={
          position === currentPosition
            ? styles.stepLabelSelected
            : styles.stepLabel
        }>
        {label}
      </Text>
    );
  };


  const renderItem = ({ item, index }) => (
    <FastImage style={styles.image} source={{uri: item.uri}} resizeMode="cover" />
  );

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

  const openCamera = () => {
    ImagePicker.launchCamera(IMAGE_CONFIG, (response) => {
      // console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        setIsLoading(true);
        setImages([...images, { uri: response.uri}]);
        // Promise.resolve(uploadFileToFireBase(response, userDetail?.id))
        //   .then((val) => {
        //     console.log('@@@@openCamera@@@@@');
        //     console.log(val);
        //     setImages([...images, val])
        //     setIsLoading(false);
        //   })
        //   .catch((error) => {
        //     console.log(error.message);
        //     ToastHelper.showError(t('error.common'));
        //     setIsLoading(false);
        //   });
      }
    });
  };
const openImagePicker = () => {
    ImagePicker.launchImageLibrary(IMAGE_CONFIG, (response) => {
      // console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        // setIsLoading(true);
        setImages([...images, { uri: response.uri}]);
        // Promise.resolve(uploadFileToFireBase(response, userDetail?.id))
        //   .then((val) => {
        //     console.log('@@@@openImagePicker@@@@@');
        //     console.log(val);
        //     setImages([...images, val])
        //     setIsLoading(false);
        //   })
        //   .catch((error) => {
        //     console.log(error.message);
        //     ToastHelper.showError(t('error.common'));
        //     setIsLoading(false);
        //   });
      }
    });
  };
  const removeImages = (item) =>{
    let current = [...images];
    console.log(current);
    console.log(item);
    current = current.filter(itm => itm.uri !== item.uri)
    setImages(current);
  }
  
  const renderTabInfomation = () => {
    return (
      <View
        style={{
          width: ScreenWidth * 0.9,
          height: '100%',
          paddingBottom: 50,
        }}>
        <View style={{marginBottom: SPACINGS.large}}>
          {RoomTypes.map((item, index) => {
            return (
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'space-between',
                  margin: SPACINGS.avg,
                }}>
                <TouchableOpacity
                  onPress={() => setRoomType(item.value)}
                  style={{flex: 1, backgroundColor: colors.ređ}}>
                  <TextNormal text={item.label} />
                </TouchableOpacity>
                <CheckBox
                  disabled={roomType === item.value}
                  onCheckColor={colors.purpleMain}
                  onTintColor={colors.purpleMain}
                  key={index}
                  value={roomType === item.value}
                  style={{height: 20}}
                  onValueChange={(newValue) => {
                    if (newValue) onRoomTypeChange(newValue, item);
                  }}
                />
              </View>
            );
          })}
        </View>

        <View
          style={[
            containerStyle.center,
            containerStyle.shadow,
            {marginBottom: SPACINGS.large},
          ]}>
          <TextInputFlat
            keyboardType="numeric"
            props={props}
            onChangeText={(text) => {
              console.log(text);
            }}
            text={t('property.numOfRoom')}
            placeholder={'0'}
            textInputStyle={[styles.field, containerStyle.defaultMarginBottom]}
            style={{marginBottom: SPACINGS.avg}}
          />
          <TextInputFlat
            keyboardType="numeric"
            props={props}
            onChangeText={(text) => {
              console.log(text);
            }}
            text={t('property.capacity')}
            placeholder={'0'}
            textInputStyle={[styles.field, containerStyle.defaultMarginBottom]}
            style={{marginBottom: SPACINGS.avg}}
          />
        </View>

        <View style={{marginBottom: SPACINGS.large}}>
          {Genders.map((item, index) => {
            return (
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'space-between',
                  margin: SPACINGS.avg,
                }}>
                <TouchableOpacity
                  onPress={() => setGender(item.value)}
                  style={{flex: 1}}>
                  <TextNormal text={item.label} />
                </TouchableOpacity>
                <CheckBox
                  disabled={gender === item.value}
                  onCheckColor={colors.purpleMain}
                  onTintColor={colors.purpleMain}
                  key={index}
                  value={gender === item.value}
                  style={{height: 20}}
                  onValueChange={(newValue) => {
                    setGender(item.value);
                  }}
                />
              </View>
            );
          })}
        </View>

        <View style={[containerStyle.center, containerStyle.shadow, {marginBottom: SPACINGS.large}]}>
          <TextInputFlat
            keyboardType="numeric"
            props={props}
            onChangeText={(text) => {
              console.log(text);
            }}
            text={t('property.rentalPrice')}
            placeholder={'0'}
            textInputStyle={[styles.field, containerStyle.defaultMarginBottom]}
          />
          <TextInputFlat
            keyboardType="numeric"
            props={props}
            onChangeText={(text) => {
              console.log(text);
            }}
            text={t('property.deposit')}
            placeholder={'0'}
            textInputStyle={[styles.field, containerStyle.defaultMarginBottom]}
          />
        </View>

        <View style={[containerStyle.center, containerStyle.shadow, {marginBottom: SPACINGS.large}]}>
          <TextInputFlatWithRightCheckbox
            keyboardType="numeric"
            props={props}
            onChangeText={(text) => {
              console.log(text);
            }}
            style={{flex: 1}}
            text={t('property.electricityCost')}
            placeholder={'0'}
            textInputStyle={[styles.field, containerStyle.defaultMarginBottom]}
            hasCheckbox={true}
          />
          <TextInputFlatWithRightCheckbox
            keyboardType="numeric"
            props={props}
            onChangeText={(text) => {
              console.log(text);
            }}
            style={{flex: 1}}
            text={t('property.waterCost')}
            placeholder={'0'}
            textInputStyle={[styles.field, containerStyle.defaultMarginBottom]}
            hasCheckbox={true}
          />
          <TextInputFlatWithRightCheckbox
            keyboardType="numeric"
            props={props}
            onChangeText={(text) => {
              console.log(text);
            }}
            style={{flex: 1}}
            text={t('property.internetCost')}
            placeholder={'0'}
            textInputStyle={[styles.field, containerStyle.defaultMarginBottom]}
            hasCheckbox={true}
          />
          <View style={{width: ScreenWidth * 0.9, marginBottom: SPACINGS.large}}>
            <TouchableOpacity
              style={{display: 'flex', flexDirection: 'row'}}
              onPress={() => {
                setParkingAvailable(!parkingAvailable);
              }}
              >
              <CheckBox
                boxType="square"
                disabled="true"
                onCheckColor={colors.purpleMain}
                onTintColor={colors.purpleMain}
                style={{height: 20}}
                value={parkingAvailable}
                onValueChange={(newvalue) => {
                  setParkingAvailable(newvalue);
                }}
              />
              <TextNormal text={t('property.parkingAvailable')}></TextNormal>
            </TouchableOpacity>
          </View>
          <TextInputFlatWithRightCheckbox
            disabled={!parkingAvailable}
            keyboardType="numeric"
            props={props}
            onChangeText={(text) => {
              console.log(text);
            }}
            style={{flex: 1}}
            text={t('property.parkingCost')}
            placeholder={'0'}
            textInputStyle={[styles.field, containerStyle.defaultMarginBottom]}
            hasCheckbox={true}
          />

          <GradientButton
            style={styles.nextButton}
            onPress={() => onNextStepPress()}
            text={t('property.next')}
          />
        </View>
      
      </View>
    );
  };
  const renderTabAddress = () => {
    return (
      <View
        style={[containerStyle.center, containerStyle.shadow,
          {width: ScreenWidth * 0.9,
          height: '100%',
          paddingBottom: 50,
        }]}>
          <TextInputFlat
          keyboardType="default"
          props={props}
          onChangeText={(text) => {
            console.log(text)
          }}
          text={t('account.address')}
          placeholder={''}
          textInputStyle={[
            styles.field,
            containerStyle.defaultMarginBottom,
          ]}
        />
          <GradientButton
            style={styles.nextButton}
            onPress={() => onNextStepPress()}
            text={t('property.next')}
          />
      </View>
    );
  };

  const renderTabUtilties = () => {
    return (
      <View
        style={[
          containerStyle.center,
          containerStyle.shadow,
          {
            width: ScreenWidth * 0.9,
            height: '100%',
            paddingBottom: 50,
          },
        ]}>
        <TextNormal
          style={{fontSize: FONTSIZES.large}}
          text={'Images and Utilities'}></TextNormal>

        <TextNormal
          style={{
            fontSize: FONTSIZES.small,
            color: colors.gray_new,
            width: ScreenWidth * 0.9,
            marginTop: SPACINGS.large
          }}
          text={'Images'}></TextNormal>
        <View
          style={{
            width: ScreenWidth * 0.9,
            borderWidth: 1,
            borderStyle: 'dashed',
            borderColor: colors.gray_new,
            borderRadius: RADIUS.default,
            minHeight: ScreenHeight / 5,
          }}>
          {images && images.length > 0 && (
            <FlatList
              numColumns={3}
              style={{
                width: ScreenWidth * 0.9,
                marginTop: 10,
                marginBottom: 10,
              }}
              data={images}
              renderItem={({item}) => {
                // console.log(item.uri);
                return (
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      margin: 10,
                    }}
                    onPress={() => removeImages(item)}>
                    <View>
                      <Ionicons
                        name={'close-circle'}
                        color={colors.purpleMain}
                        size={16}
                        style={{
                          position: 'absolute',
                          right: 0,
                          top: 0,
                          zIndex: 999,
                        }}></Ionicons>
                      <FastImage
                        style={{
                          width: '100%',
                          height: 100,
                          borderRadius: RADIUS.default,
                        }}
                        source={{uri: item.uri}}
                        resizeMode="cover"
                      />
                    </View>
                  </TouchableOpacity>
                );
              }}></FlatList>
          )}
          {images && images.length == 0 && (
            <View style={[containerStyle.center, {color: colors.gray_new}]}>
              <MaterialCommunityIcons
                onPress={() => openImagePicker()}
                color={colors.gray_new}
                name={'image-plus'}
                size={48}
              />
              <TextNormal
                style={{color: colors.gray_new}}
                text={'Click here to post images'}></TextNormal>
              <TextNormal
                style={{color: colors.gray_new}}
                text={'from the gallery!'}></TextNormal>
            </View>
          )}
          {images && images.length > 0 && (
            <View style={[containerStyle.center, {color: colors.gray_new}]}>
              <TouchableOpacity onPress={() => openImagePicker()}>
                <TextNormal
                  style={{color: colors.purpleMain, fontSize: FONTSIZES.avg}}
                  text={'Post more picture'}></TextNormal>
              </TouchableOpacity>
              <TextNormal
                numberOfLines={2}
                style={{color: colors.gray_new, textAlign: 'center'}}
                text={
                  'Limited at least 4 images, maximum of 20 images and do not exceed over 10 mb'
                }></TextNormal>
            </View>
          )}
        </View>
        <GradientButton
          style={styles.captureButton}
          onPress={() => openCamera()}
          text={t('property.takeAPicture')}
          hasIco={true}
          ico={
            <Ionicons
              name={'camera'}
              size={36}
              color={colors.whiteBackground}></Ionicons>
          }
        />

        <TextNormal
          style={{
            fontSize: FONTSIZES.small,
            color: colors.gray_new,
            width: ScreenWidth * 0.9,
            marginTop: SPACINGS.large
          }}
          text={'Utilities'}></TextNormal>
        <View
          style={[
            containerStyle.center,
            {
              color: colors.gray_new,
              width: ScreenWidth * 0.9,
            },
          ]}>
          <FlatList
            numColumns={2}
            style={{
              margin: SPACINGS.avg,
              width: ScreenWidth * 0.9,
            }}
            data={ListUltilities}
            renderItem={({item}) => {
              isSelected = selectedUltilities.indexOf(item.value) !== -1;
              return (
                <TouchableOpacity onPress={() => doSelectUltilities(item)}>
                  <View
                    style={{
                      width: ScreenWidth * 0.4,
                      backgroundColor: colors.gray_bg_new,
                      margin: SPACINGS.avg,
                      borderRadius: 40,
                      padding: SPACINGS.small,
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-around',
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
        </View>
        <GradientButton
          style={styles.nextButton}
          onPress={() => onNextStepPress()}
          text={t('property.publishRoom')}
        />
      </View>
    );
  };

  const renderTabConfirmation = () => {
    return (
      <View
        style={[
          containerStyle.center,
          containerStyle.shadow,
          {
            width: ScreenWidth * 0.9,
            height: '100%',
            paddingBottom: 50,
          },
        ]}>
        <TextNormal
          style={{fontSize: FONTSIZES.large}}
          text={'Confirmation'}></TextNormal>

        <View
          style={[
            containerStyle.center,
            containerStyle.shadow,
            {marginBottom: SPACINGS.large},
          ]}>
          <TextInputFlat
            keyboardType="numeric"
            props={props}
            onChangeText={(text) => {
              console.log(text);
            }}
            text={t('property.phone')}
            placeholder={t('property.phone')}
            textInputStyle={[styles.field, containerStyle.defaultMarginBottom]}
          />
          <TextInputFlat
            keyboardType="default"
            props={props}
            onChangeText={(text) => {
              console.log(text);
            }}
            text={t('property.title')}
            placeholder={t('property.title')}
            textInputStyle={[styles.field, containerStyle.defaultMarginBottom]}
          />
          <TextInputFlat
            keyboardType="default"
            props={props}
            onChangeText={(text) => {
              console.log(text);
            }}
            text={t('property.description')}
            placeholder={t('property.description')}
            textInputStyle={[styles.field, containerStyle.defaultMarginBottom]}
          />
          <View
            style={{
              width: ScreenWidth * 0.9,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <TextInputFlatNew
              keyboardType="default"
              props={props}
              placeholder={'open time'}
              textInputStyle={[
                styles.field,
                containerStyle.defaultMarginBottom,
                {
                  width: ScreenWidth * 0.4,
                  backgroundColor: colors.gray_bg_new,
                },
              ]}
              value={openTime ? moment(openTime).format('HH:mm') : ''}
              style={{width: ScreenWidth * 0.4}}
              hasRightIco={true}
              ico={<Ionicons name={'time'} size={24}></Ionicons>}
              onPressIco={() => setShowOpenTime(true)}
            />
            <DateTimePickerModal
              isVisible={showOpenTime}
              mode="time"
              isDarkModeEnabled={false}
              onConfirm={(date) => {
                setOpenTime(moment(date).toDate());
                setShowOpenTime(false);
              }}
              date={openTime}
              onCancel={() => setShowOpenTime(false)}
              cancelTextIOS={t('common.cancel')}
              confirmTextIOS={t('common.confirm')}
              headerTextIOS={t('common.pickATime')}
            />

              <TextInputFlatNew
              onPress={() => setShowCloseTime(true)}
                value={openTime ? moment(closeTime).format('HH:mm') : ''}
                keyboardType="default"
                props={props}
                placeholder={'close time'}
                textInputStyle={[
                  styles.field,
                  containerStyle.defaultMarginBottom,
                  {
                    width: ScreenWidth * 0.4,
                    backgroundColor: colors.gray_bg_new,
                  },
                ]}
                style={{width: ScreenWidth * 0.4}}
                hasRightIco={true}
                ico={<Ionicons name={'time'} size={24}></Ionicons>}
                onPressIco={() => setShowCloseTime(true)}
              />
            <DateTimePickerModal
              isVisible={showCloseTime}
              mode="time"
              isDarkModeEnabled={false}
              onConfirm={(date) => {
                setCloseTime(moment(date).toDate());
                setShowCloseTime(false);
              }}
              date={closeTime}
              onCancel={() => setShowCloseTime(false)}
              cancelTextIOS={t('common.cancel')}
              confirmTextIOS={t('common.confirm')}
              headerTextIOS={t('common.pickADate')}
            />
          </View>
        </View>
        <GradientButton
          style={styles.nextButton}
          onPress={() => onNextStepPress()}
          text={t('property.publishRoom')}
        />
      </View>
    );
  };

  const renderForm = () =>{
    switch(currentPage) {
      case 0: 
        return renderTabInfomation();
      case 1:
        return renderTabAddress();
      case 2:
        return renderTabUtilties();
      case 3:
        return renderTabConfirmation();
      default:
        return;
    }
  }

  return useObserver(() =>(
    <View style={[containerStyle.default]}>
      <StatusBar barStyle={colorsApp.statusBar} />
      <SafeAreaView>
        <HeaderFull title={t('property.createTitle')} hasButton rightIco={rightIco} onPress={() => console.log('@@@@@@')}/>
        <View style={styles.stepIndicator}>
          <StepIndicator
            customStyles={customStyles}
            currentPosition={currentPage}
            onPress={onStepPress}
            renderStepIndicator={renderStepIndicator}
            labels={labels}
            renderLabel={renderLabel}
            stepCount={4}
          />
        </View>
        <KeyboardAwareScrollView nestedScrollEnabled
          contentContainerStyle={styles.content}>
          {renderForm()}
        </KeyboardAwareScrollView>
      </SafeAreaView>
      {isLoading && <Loading />}
    </View>
  ));
  };
export default withTheme(PropertyScreen);
