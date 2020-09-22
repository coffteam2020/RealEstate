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
import Empty from '../../shared/components/Empty';


const PropertyListScreen = (props) => {
  const {colorsApp} = props.theme;
  const {t} = useTranslation();
  const {userStore} = useStores();
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    props?.navigation.addListener('willFocus', () => {
      getPropertyList();
    });
    getPropertyList();
  }, []);
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

  const getPropertyList = async () => {
    setIsLoading(true);
    AxiosFetcher({
      method: 'GET',
      url: '/property/findAllWithPagination/?limit=1000&offset=0&sortBy=id',
      hasToken: true,
    })
      .then(async (val) => {
        setIsLoading(false);
        if (val?.content !== '') {
          setProperties(val.content);
        } else {
          // ToastHelper.showError(t('account.getInfoErr'));
          setProperties([]);
        }
      })
      .catch((error) => {
        console.log("****************************")
        console.log(error)
        setIsLoading(false);
        setProperties([]);
        // ToastHelper.showError(t('account.getInfoErr'));
      });
  };

  const renderMates = () => {
    if (properties && properties.length === 0) {
      return <Empty />;
    }
    return (
      <FlatList
        data={properties}
        scrollEnabled
        style={{
          width: ScreenWidth * 0.9,
          height: '100%',
          marginTop: 10,
        }}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => {
          console.log(item)
          return (
            <TouchableOpacity
              onPress={() => {
                NavigationService.navigate(ScreenNames.PropertyDetailScreen, {
                  data: item,
                });
              }}
              style={[
                containerStyle.defaultMarginBottom,
                containerStyle.shadow,
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
                    {/* <TextNormal text={item.projectName}></TextNormal> */}
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
        <ScrollView nestedScrollEnabled contentContainerStyle={styles.content}>
          {renderMates()}
        </ScrollView>
      </SafeAreaView>
    </View>
  ));
  };
export default withTheme(PropertyListScreen);
