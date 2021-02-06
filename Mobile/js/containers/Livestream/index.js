import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  View,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { styles as style, styles } from './style';
import { withTheme } from 'react-native-paper';
import TextNormal from '../../shared/components/Text/TextNormal';
import { useTranslation } from 'react-i18next';
import Loading from '../../shared/components/Loading';
import DialogInput from 'react-native-dialog-input';
import { NavigationService } from '../../navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Back from '../../shared/components/Icons/Back';
import { colors } from '../../shared/utils/colors/colors';
import { ScreenNames } from '../../route/ScreenNames';
import AxiosFetcher from '../../api/AxiosFetch';
import IALocalStorage from '../../shared/utils/storage/IALocalStorage';
import TrackPlayer from 'react-native-track-player';
import { firebase } from '@react-native-firebase/database';
import Constant from '../../shared/utils/constant/Constant';
import { FlatList } from 'react-native-gesture-handler';
import { ScreenWidth } from '../../shared/utils/dimension/Divices';
import FastImage from 'react-native-fast-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Empty from '../../shared/components/Empty';
import TextInputFlat from '../../shared/components/TextInput/TextInputFlat';
import { useStores } from '../../store/useStore';
import { ToastHelper } from '../../shared/components/ToastHelper';
import LogManager from '../../shared/utils/logging/LogManager';
import { containerStyle } from '../../themes/styles';
const { width } = Dimensions.get('window');
const IMG =
  'https://firebasestorage.googleapis.com/v0/b/stayalone-prod.appspot.com/o/blur.jpg?alt=media&token=23d5379e-8c8f-4f0b-8926-59811eeb9ce4';
const Livestream = (props) => {
  const { colorsApp } = props.theme;
  const [isLoading, setIsLoading] = useState(false);
  const [] = useState('');
  const { t } = useTranslation();
  const [livestream, setLivestreamRooms] = useState([]);
  const [livestreamT, setLivestreamRoomsT] = useState([]);
  const { userStore } = useStores();
  const [pass, setPass] = useState('');
  const [dialog, showDialog] = useState(false);
  const [tickLivestream, setTickLivestream] = useState(null);

  useEffect(() => {
    TrackPlayer.stop();
    getLivestreamingChannel();
  }, []);

  const getLivestreamingChannel = async () => {
    firebase
      .database()
      .ref(Constant.SCHEMA.LIVESTREAM)
      .on('value', (snapshot) => {
        const data = snapshot.val() || [];
        setLivestreamRooms(Object.values(data)?.filter(i => i.status == "LIVESTREAMING" && i?.channelName && i?.uid && i?.participiants?.length > 0));
        setLivestreamRoomsT(Object.values(data)?.filter(i => i.status == "LIVESTREAMING"&& i?.channelName && i?.uid && i?.participiants?.length > 0));
      });
  };

  const onCreateLivestream = async () => {
    NavigationService.navigate(ScreenNames.InformationRoom);
  };

  const renderHeader = () => {
    return (
      <View>
        <View style={style.header}>
          <TouchableOpacity
            onPress={() => NavigationService.goBack()}
            style={{ flexDirection: 'row' }}>
            <Back
              props={props}
              onPress={() => NavigationService.goBack()}
              style={{ marginLeft: 15 }}
            />
          </TouchableOpacity>
          <TextNormal
            props={props}
            text={'Live stream'}
            style={[
              containerStyle.textHeader,
              { color: colors.textBlue, textAlignVertical: 'center' },
            ]}
          />
          <TouchableOpacity
            onPress={() => {
              onCreateLivestream();
            }}
            style={{ flexDirection: 'row', marginEnd: 10, padding: 5 }}>
            <TextNormal
              props={props}
              text={t('chat.goLive')}
              style={[
                containerStyle.textContent,
                { color: colors.textBlue, textAlignVertical: 'center' },
              ]}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const onJoinLivestream = async (curLiveStream) => {
    setTickLivestream(curLiveStream);
    let user = await IALocalStorage.getDetailUserInfo();

    if (curLiveStream?.status === 'END') {
      alert('This livestreaming is end');
      return;
    }
    if (
      curLiveStream?.ownerUserId?.id !== user?.userId &&
      curLiveStream?.password &&
      curLiveStream?.password != ''
    ) {
      showDialog(true);
      return;
    }
    NavigationService.navigate(ScreenNames.VideoCallScreen, {
      curLiveStream: curLiveStream,
    });
  };

  const renderItem = (item, index) => {
    let channelName = item.channelName?.toString()?.split('_')[0];
    let tags = '';
    (item?.tags || []).forEach((element) => {
      tags = tags + element + '\n';
    });
    tags = tags?.substring(0, tags.lastIndexOf('\n'));

    // Rating by ranking and participiants
    let rateCount = item?.ownerUserId?.rate || 0;
    rateCount += item?.participiants?.length || 0;
    let color =
      'rgba(256,256,0,' +
      (rateCount === 0
        ? '0.6'
        : rateCount < 20
          ? '0.8'
          : rateCount < 50
            ? '0.8'
            : '1') +
      ')';
    return (
      <TouchableOpacity
        onPress={() => {
          onJoinLivestream(item);
        }}
        style={[styles.item, { marginLeft: index % 2 === 0 ? 3 : -5 }]}>
        <FastImage
          source={{ uri: item?.ownerUserId?.avatar || IMG }}
          style={{
            height: (ScreenWidth - 30) / 2,
            width: (ScreenWidth - 30) / 2,
            borderRadius: 15,
          }}
          resizeMethod="resize"
          cache={FastImage.cacheControl.immutable}
          resizeMode="cover"
        />
        <View style={styles.count}>
          <Ionicons name="ios-eye" size={20} color={'white'} />
          <TextNormal
            text={` ${item?.status === 'END' ? 0 : item?.participiants?.length || 0}`}
            style={[containerStyle.textDefault, { color: colors.whiteBackground }]}
          />
        </View>
        <View style={styles.rate}>
          <MaterialCommunityIcons name="star-face" size={20} color={color} />
          {rateCount >= 20 && (
            <MaterialCommunityIcons name="star-face" size={20} color={color} />
          )}
          {rateCount >= 50 && (
            <MaterialCommunityIcons name="star-face" size={20} color={color} />
          )}
        </View>
        <View style={[styles.id]}>
          <TextNormal
            numberOfLines={1}
            text={`#${item?.uid}`}
            style={[
              containerStyle.textContentSmall,
              { color: colors.whiteBackground },
            ]}
          />
        </View>
        <View style={styles.livestreamItem}>
          <TextNormal
            numberOfLines={3}
            text={`${channelName}`}
            style={[containerStyle.textHeader, { color: colors.whiteBackground }]}
          />
          <TextNormal
            numberOfLines={3}
            text={`${item?.ownerUserId?.name || ''} `}
            style={[
              containerStyle.textDefault,
              { color: colors.whiteBackground },
            ]}
          />
          {item?.tags && item?.tags?.length > 0 ? (
            <TextNormal
              numberOfLines={3}
              text={tags || ''}
              style={[
                containerStyle.textContentSmall,
                { color: colors.whiteBackground, width: ScreenWidth * 0.25 },
              ]}
            />
          ) : (
              <TextNormal
                numberOfLines={3}
                text={item?.ownerUserId?.address || ''}
                style={[
                  containerStyle.textContentSmall,
                  { color: colors.whiteBackground },
                ]}
              />
            )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[{ backgroundColor: colors.pinkBackground, flex: 1 }]}>
      <StatusBar barStyle={colorsApp.statusBar} />
      <SafeAreaView>
        {renderHeader()}
        <View>
          {
            <TextInputFlat
              onChangeText={(text) => {
                if (text?.trim() === '') {
                  setLivestreamRooms(livestreamT);
                } else {
                  let arr = [];
                  for (let i = 0; i < livestreamT?.length; i++) {
                    if (
                      livestream[i]?.ownerUserId?.name
                        ?.toLowerCase()
                        .includes(text?.toLowerCase()) ||
                      String(livestream[i]?.uid)?.includes(
                        text?.toLowerCase(),
                      ) ||
                      livestream[i]?.ownerUserId?.name
                        ?.toLowerCase()
                        .includes(text?.toLowerCase()) ||
                      livestream[i]?.tags?.includes(text?.toLowerCase()) ||
                      livestream[i]?.channelName
                        ?.toLowerCase()
                        .includes(text?.toLowerCase())
                    ) {
                      arr?.push(livestream[i]);
                    }
                  }
                  setLivestreamRooms(arr);
                }
              }}
              props={props}
              style={{ width: '90%', alignSelf: 'center', marginBottom: 20 }}
              placeholder={t('chat.motto')}
            />
          }
        </View>
        {livestream?.filter((item) => item?.status != 'END')?.length === 0 ? (
          <Empty />
        ) : (
            <FlatList
              numColumns={2}
              contentContainerStyle={{paddingBottom: width * 0.35}}
              showsVerticalScrollIndicator={false}
              data={livestream?.filter((item) => item?.status !== 'END')}
              renderItem={({ item, index }) => renderItem(item, index)}
              keyExtractor={(item, index) => index.toString()}
              ListFooterComponent={() => <View style={{ height: 16 }} />}
            />
          )}
        <DialogInput
          isDialogVisible={dialog}
          title={'This room is private.'}
          message={'Enter a password to jump in'}
          hintInput={'Room`s password'}
          submitInput={(inputText) => {
            showDialog(false);
            if (inputText === tickLivestream?.password) {
              NavigationService.navigate(ScreenNames.VideoCallScreen, {
                curLiveStream: tickLivestream,
              });
            } else {
              ToastHelper.showError(
                'You inputted wrong password for this room',
              );
            }
          }}
          closeDialog={() => { }}
        />
        {isLoading ? <Loading /> : null}
      </SafeAreaView>
    </View>
  );
};

export default withTheme(Livestream);
