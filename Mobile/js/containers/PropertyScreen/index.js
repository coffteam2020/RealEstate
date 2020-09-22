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
import {uploadFileToFireBase} from '../../shared/utils/firebaseStorageUtils';
import ModalConfirm from '../../shared/components/Modal/ModalConfirm';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

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
  const PropertyTypes = [
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

  const Roles = [
    {label: 'Owner', value: 'Owner'},
    {label: 'Broker', value: 'Broker'},
    {label: 'Builder', value: 'Builder'}
  ];

const PropertyScreen = (props) => {
  const {colorsApp} = props.theme;
  const {t} = useTranslation();
  const {userStore} = useStores();
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [avt, setAvt] = useState('');
  const [propertyType, setPropertyType] = useState(PropertyTypes[0].value);
  const [gender, setGender] = useState(Genders[0].value);
  const [currentPage, setCurrentPage] = useState(0);
  const [parkingAvailable, setParkingAvailable] = useState(false);
  const [property, setProperty] = useState({});
  const [address, setAddress] = useState({});
  const [images, setImages] = useState([]);
  const [localImages, setLocalImages] = useState([]);
  const [firebaseImages, setFirebaseImages] = useState([]);
  const [attachmentMedia, setAttachmentMedia] = useState([]);
  const [selectedUltilities, setSelectedUltilities] = useState([]);
  const [showOpenTime, setShowOpenTime] = useState(false);
  const [showCloseTime, setShowCloseTime] = useState(false);
  const [availabilityDate, setAvailabilityDate] = useState(new Date());
  const [closeTime, setCloseTime] = useState(new Date());
  const [reservedParking, setReservedParking] = useState(0);
  const [leaseDuration, setLeaseDuration] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [role, setRole] = useState(Roles[0].value);

  const propertyParam = props?.navigation?.state?.params?.data || null;

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
      // getProfile();
      initPropertFromParam();
    });
    // getProfile();
    initPropertFromParam();
  }, []);

  const initPropertFromParam = () =>{
    if(null != propertyParam){
      console.log(propertyParam)
      setProperty(propertyParam);
      if(propertyParam?.address){
        setAddress({address:propertyParam?.address})
        console.log({address: propertyParam?.address})
      }
      setSelectedUltilities(propertyParam?.amenities);
      setImages(propertyParam.photos);
      if(propertyParam?.youAre)
        setRole(propertyParam?.youAre);
      if(propertyParam?.propertyFor)
        setGender(propertyParam?.propertyFor);
      if(propertyParam?.propertyType)
        setPropertyType(propertyParam?.propertyType);
    }
  }
  // const getProfile = async () => {
  //   let userInfo = await IALocalStorage.getDetailUserInfo();
  //   setIsLoading(true);
  //   AxiosFetcher({
  //     method: 'GET',
  //     url: 'user/' + userInfo?.id,
  //     hasToken: true,
  //   })
  //     .then((val) => {
  //       if (val?.data !== '') {
  //         setIsLoading(false);
  //         userStore.userInfo = val;
  //         setUserInfo(val);
  //         setAvt(val?.avatar);
  //       } else {
  //         setIsLoading(false);
  //         ToastHelper.showError(t('account.getInfoErr'));
  //       }
  //     })
  //     .catch(() => {
  //       setIsLoading(false);
  //       ToastHelper.showError(t('account.getInfoErr'));
  //     });
  // };

  const onStepPress = (position) => {
    setCurrentPage(position);
  };
  const onNextStepPress = () => {
    if (currentPage === 2) {
      //TODO: step 2: upload images to firebase
      let attachments = [];
      localImages.forEach(async (item) => {
        Promise.resolve(uploadFileToFireBase(item, userStore?.userInfo?.id))
          .then((val) => {
            attachments.push({attactmentType: 'PHOTO', urlMedia: val});
          })
          .catch((error) => {
            console.log(error.message);
          });
      });
      //Edit case
      if(images && images.length > 0){
        images.forEach(item => {
          attachments.push({attactmentType: 'PHOTO', urlMedia: item});
        })
      }
      setAttachmentMedia(attachments);
    }else if(currentPage === 3){
      setShowModal(true);
    }
    setCurrentPage(currentPage + 1);
  };

  const onTypeChange = (evt, item) => {
    if(!evt){
      setPropertyType(PropertyTypes[0].value);
    }else{
      setPropertyType(item.value);
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
        setLocalImages([...localImages, response]);
        setImages([...images, response.uri]);
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
        setLocalImages([...localImages, response]);
        setImages([...images, response.uri]);
      }
    });
  };
  const removeImages = (item) =>{
    let current = [...images];
    current = current.filter(itm => itm !== item)
    setImages(current);
  }
  
  const handleInputField = (field, value) =>{
    setProperty({...property, [field] : value});
  }

  const handleInputFieldAddress = (field, value) =>{
    setAddress({...address, [field] : value});
  }

  const renderTabInfomation = () => {
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
          text={t('property.information')}></TextNormal>
        <TextNormal
          style={{width: ScreenWidth * 0.9}}
          text={t('property.propertyType')}></TextNormal>
        <View style={{marginBottom: SPACINGS.large, width: ScreenWidth * 0.7}}>
          {PropertyTypes.map((item, index) => {
            return (
              <View
                key={"PropertyTypes-" + index}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'space-between',
                  margin: SPACINGS.avg,
                }}>
                <TouchableOpacity
                  onPress={() => setPropertyType(item.value)}
                  style={{flex: 1, backgroundColor: colors.ređ}}>
                  <TextNormal text={item.label} />
                </TouchableOpacity>
                <CheckBox
                  disabled={propertyType === item.value}
                  onCheckColor={colors.purpleMain}
                  onTintColor={colors.purpleMain}
                  key={index}
                  value={propertyType === item.value}
                  style={{height: 20}}
                  onValueChange={(newValue) => {
                    if (newValue) onTypeChange(newValue, item);
                  }}
                />
              </View>
            );
          })}
        </View>

        <View style={{marginBottom: SPACINGS.large}}>
          <TextInputFlat
            keyboardType="numeric"
            props={props}
            onChangeText={(text) => {
              handleInputField('bedRoom', text);
            }}
            text={t('property.numOfRoom')}
            value={property?.bedRoom ?  (property?.bedRoom  + '' ) : ''}
            placeholder={'0'}
            textInputStyle={[styles.field, containerStyle.defaultMarginBottom]}
            style={{marginBottom: SPACINGS.avg}}
          />
          <TextInputFlat
            keyboardType="numeric"
            props={props}
            onChangeText={(text) => {
              handleInputField("areaUnit", text)
            }}
            text={t('property.areaUnit')}
            value={property?.areaUnit || ''}
            placeholder={'0'}
            textInputStyle={[styles.field, containerStyle.defaultMarginBottom]}
            style={{marginBottom: SPACINGS.avg}}
          />
        </View>

        <TextNormal
          style={{width: ScreenWidth * 0.9}}
          text={t('property.youAre')}></TextNormal>
        <View style={{marginBottom: SPACINGS.large, width: ScreenWidth * 0.7}}>
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
              handleInputField('priceOrMonthlyRent', text);
            }}
            text={t('property.rentalPrice')}
            value={property?.priceOrMonthlyRent ?  (property?.priceOrMonthlyRent  + '' ) : ''}
            placeholder={'0'}
            textInputStyle={[styles.field, containerStyle.defaultMarginBottom]}
          />
          <TextInputFlat
            keyboardType="numeric"
            props={props}
            onChangeText={(text) => {
              handleInputField('bookingAmount', text);
            }}
            value={property?.bookingAmount ?  (property?.bookingAmount  + '' ) : ''}
            text={t('property.deposit')}
            placeholder={'0'}
            textInputStyle={[styles.field, containerStyle.defaultMarginBottom]}
          />
        </View>

        <View
          style={[
            containerStyle.center,
            containerStyle.shadow,
            {marginBottom: SPACINGS.large},
          ]}>
          <TouchableOpacity
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: ScreenWidth * 0.9,
            }}
            onPress={() => {
              setLeaseDuration(!leaseDuration);
              handleInputField('leaseDuration', !leaseDuration);
            }}>
            <CheckBox
              boxType="square"
              disabled="true"
              onCheckColor={colors.purpleMain}
              onTintColor={colors.purpleMain}
              style={{height: 20}}
              value={leaseDuration}
            />
            <TextNormal text={t('property.leaseDuration')}></TextNormal>
          </TouchableOpacity>
          <TextInputFlatWithRightCheckbox
            disabled={!leaseDuration}
            keyboardType="numeric"
            props={props}
            onChangeText={(text) => {
              handleInputField('leaseDurationMonth', text);
            }}
            value={property.leaseDurationMonth || ''}
            style={{flex: 1}}
            placeholder={'0'}
            textInputStyle={[styles.field, containerStyle.defaultMarginBottom]}
          />
          <View
            style={{width: ScreenWidth * 0.9, marginBottom: SPACINGS.large}}>
            <TouchableOpacity
              style={{display: 'flex', flexDirection: 'row'}}
              onPress={() => {
                setParkingAvailable(!parkingAvailable);
                console.log(!parkingAvailable);
                if (parkingAvailable) {
                  setReservedParking(0);
                  setProperty({...property, reservedParking: ''});
                }
              }}>
              <CheckBox
                boxType="square"
                disabled="true"
                onCheckColor={colors.purpleMain}
                onTintColor={colors.purpleMain}
                style={{height: 20}}
                value={parkingAvailable}
              />
              <TextNormal text={t('property.parkingAvailable')}></TextNormal>
            </TouchableOpacity>
          </View>
          <TextInputFlatWithRightCheckbox
            disabled={!parkingAvailable}
            keyboardType="numeric"
            props={props}
            onChangeText={(text) => {
              handleInputField('reservedParking', text);
              setReservedParking(text);
            }}
            value={reservedParking}
            style={{flex: 1}}
            text={t('property.parkingCost')}
            placeholder={'0'}
            textInputStyle={[styles.field, containerStyle.defaultMarginBottom]}
            hasCheckbox={true}
            checkboxChange={(checked) => {
              console.log(checked);
              if (checked) {
                setProperty({...property, reservedParking: 0});
              } else {
                setProperty({...property, reservedParking: reservedParking});
              }
            }}
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
            {/* <GooglePlacesAutocomplete
            onPress={(data, details = null) => console.log(data)}
            onFail={(error) => console.error(error)}
              placeholder='Enter Location'
              minLength={2}
              autoFocus={true}
              returnKeyType={'default'}
              fetchDetails={true}
              query={{
                key: 'AIzaSyCT8yb4sYoFaNhAyaNJaj22fRRN8xny7tk',
              }}
              styles={{
                textInputContainer: {
                  backgroundColor: 'rgba(0,0,0,0)',
                  borderTopWidth: 0,
                  borderBottomWidth: 0,
                  width: ScreenWidth * 0.9,
                  borderRadius: RADIUS.default,
                },
                textInput: {
                  marginLeft: 0,
                  marginRight: 0,
                  height: 38,
                  color: '#5d5d5d',
                  fontSize: 16,
                  borderRadius: RADIUS.default,
                },
                predefinedPlacesDescription: {
                  color: '#1faadb',
                },
              }}
            /> */}
          <TextInputFlat
          keyboardType="default"
          props={props}
          onChangeText={(text) => {
            handleInputFieldAddress("address", text);
          }}
          text={t('account.address')}
          value={address?.address || ''}
          placeholder={''}
          textInputStyle={[
            styles.field,
            containerStyle.defaultMarginBottom,
          ]}
        />
        {/* <TextInputFlat
          keyboardType="default"
          props={props}
          onChangeText={(text) => {
            handleInputFieldAddress("district", text);
          }}
          value={address?.district || ''}
          text={t('account.district')}
          placeholder={''}
          textInputStyle={[
            styles.field,
            containerStyle.defaultMarginBottom,
          ]}
        />
        <TextInputFlat
          keyboardType="default"
          props={props}
          onChangeText={(text) => {
            handleInputFieldAddress("city", text);
          }}
          value={address?.city || ''}
          text={t('account.city')}
          placeholder={''}
          textInputStyle={[
            styles.field,
            containerStyle.defaultMarginBottom,
          ]}
        /> */}
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
              keyExtractor={(item, index) => index}
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
                        source={{uri: item}}
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
                      alignContent: "center",
                      alignItems: "center"
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
            width: ScreenWidth * 0.7,
            height: '100%',
            paddingBottom: 50,
          },
        ]}>
        <TextNormal
          style={{fontSize: FONTSIZES.large}}
          text={'Confirmation'}></TextNormal>
        <TextNormal
          style={{width: ScreenWidth * 0.9}}
          text={t('property.youAre')}></TextNormal>
        {Roles.map((item, index) => {
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
                onPress={() => setRole(item.value)}
                style={{flex: 1}}>
                <TextNormal text={item.label} />
              </TouchableOpacity>
              <CheckBox
                disabled={role === item.value}
                onCheckColor={colors.purpleMain}
                onTintColor={colors.purpleMain}
                key={index}
                value={role === item.value}
                style={{height: 20}}
                onValueChange={(newValue) => {
                  if (newValue) setRole(item.value);
                }}
              />
            </View>
          );
        })}

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
              handleInputField('phoneContact', text);
            }}
            value={property?.phoneContact ?  (property?.phoneContact  + '' ) : ''}
            text={t('property.phone')}
            placeholder={t('property.phone')}
            textInputStyle={[styles.field, containerStyle.defaultMarginBottom]}
          />
          <TextInputFlat
            keyboardType="default"
            props={props}
            onChangeText={(text) => {
              handleInputField('projectName', text);
            }}
            value={property?.projectName ?  (property?.projectName  + '' ) : ''}
            text={t('property.title')}
            placeholder={t('property.title')}
            textInputStyle={[styles.field, containerStyle.defaultMarginBottom]}
          />
          <TextInputFlat
            keyboardType="default"
            props={props}
            value={property?.description ?  (property?.description  + '' ) : ''}
            onChangeText={(text) => {
              handleInputField('description', text);
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
              value={
                availabilityDate
                  ? moment(availabilityDate).format('DD/MM/yyyy')
                  : ''
              }
              style={{width: ScreenWidth * 0.4}}
              hasRightIco={true}
              ico={<Ionicons name={'time'} size={24}></Ionicons>}
              onPressIco={() => setShowOpenTime(true)}
            />
            <DateTimePickerModal
              isVisible={showOpenTime}
              mode="date"
              isDarkModeEnabled={false}
              onConfirm={(date) => {
                setAvailabilityDate(moment(date).toDate());
                setShowOpenTime(false);
              }}
              date={availabilityDate}
              onCancel={() => setShowOpenTime(false)}
              cancelTextIOS={t('common.cancel')}
              confirmTextIOS={t('common.confirm')}
              headerTextIOS={t('common.pickATime')}
            />

            {/* <TextInputFlatNew
              onPress={() => setShowCloseTime(true)}
                value={openTime ? moment(closeTime).format('DD/MM/yyyy') : ''}
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
              mode="date"
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
            /> */}
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

  const renderConfirmationPopup = () => {
    let title = "Confirmation";
    let subTitle = "Do you want to publish?";
    return (
    <View>
    {showModal ? (
      <ModalConfirm
        isVisible={showModal}
        title={title}
        subTitle={subTitle}
        onPress={() => {
          postNewProperty();
        }}
        onClose={() => {
          setShowModal(false);
          setCurrentPage(currentPage - 1);
        }}
      />
    ) : null}
    </View>)
  }

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
      case 4:
        return renderConfirmationPopup();
      default:
        return;
    }
  }
  const postNewProperty = () => {
    console.log(address)
    let amenities = initAmenities();

    let propertyDTO = {
      ...property,
      propertyType: propertyType,
      propertyFor: gender,
      amenities: amenities,
      attachmentMedia: attachmentMedia,
      address: address,
      availabilityDate: moment(availabilityDate).valueOf(),
      youAre: role
    };
    console.log("propertyDTO @@@@@@@@@@@@@@@@@@@@@@@@@@@");
    console.log(propertyDTO);
    setIsLoading(true);
    AxiosFetcher({
      method: 'POST',
      url: property?.id ? '/property/update' : '/property/create',
      hasToken: true,
      data: propertyDTO
    })
      .then((val) => {
        if (val !== '') {
          setIsLoading(false);
          NavigationService.navigate(ScreenNames.PropertyListScreen);
        } else {
          setIsLoading(false);
          ToastHelper.showError(t('account.getInfoErr'));
        }
        console.log(val);
        //TODO
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        ToastHelper.showError(t('account.getInfoErr'));
      });
  };

  const initAmenities = () => {
    let amenities = [];
    selectedUltilities.forEach((item) => {
      let amenitiy = {amenityType: item};
      amenities.push(amenitiy);
    });
    return amenities;
  };

  return useObserver(() =>(
    <View style={[containerStyle.default]}>
      <StatusBar barStyle={colorsApp.statusBar} />
      <SafeAreaView>
        <HeaderFull title={t('property.createTitle')} hasButton/>
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
