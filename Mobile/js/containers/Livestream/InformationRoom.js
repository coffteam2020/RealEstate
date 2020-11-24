/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  StatusBar,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {styles as style} from './style';
import {withTheme} from 'react-native-paper';
import TrackPlayer from 'react-native-track-player';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {ToastHelper} from '../../shared/components/ToastHelper';
import {NavigationService} from '../../navigation';
import {ScreenNames} from '../../route/ScreenNames';
import Back from '../../shared/components/Icons/Back';
import TextNormal from '../../shared/components/Text/TextNormal';
import {containerStyle} from '../../themes/styles';
import TextInputFlat from '../../shared/components/TextInput/TextInputFlat';
import GradientButton from '../../shared/components/Buttons/GradientButton';
import Loading from '../../shared/components/Loading';
import { colors } from '../../shared/utils/colors/colors';
import { useTranslation } from 'react-i18next';

const InformationRoom = (props) => {
  const {colorsApp} = props.theme;
  const [isLoading] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [tags, setTags] = useState('');
  const [password, setPassword] = useState('');
  const {t}= useTranslation();
  useEffect(() => {
    TrackPlayer.stop();
  }, []);

  const removeVietnameseTones = (str) => {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y");
    str = str.replace(/đ/g,"d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣ huyền, sắc, ngã, hỏi, nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛ Â, Ê, Ă, Ơ, Ư
    // Remove extra spaces
    // Bỏ các khoảng trắng liền nhau
    str = str.replace(/ + /g," ");
    str = str.trim();
    // Remove punctuations
    // Bỏ dấu câu, kí tự đặc biệt
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
    return str;
    }

  const onCreateLivestream = () => {
    if (roomName === '') {
      ToastHelper.showError('Dont leave us empty!');
      return;
    }
    let tagSplited = tags?.split(',');
    for (let i = 0; i < tagSplited?.length; i++) {
      if (typeof tagSplited[i] === 'string') {
        if (!tagSplited[i]?.trim().includes('#')) {
          tagSplited[i] = '#' + tagSplited[i]?.trim();
          tagSplited[i] = tagSplited[i]?.trim();
        }
      }
    }
    NavigationService.navigate(ScreenNames.VideoCallScreen, {
      data: {
        channelName: removeVietnameseTones(roomName),
        category: removeVietnameseTones(category),
        note: removeVietnameseTones(note),
        password: password,
        tags: tagSplited,
      },
    });
  };

  const renderHeader = () => {
    return (
      <View style={style.header}>
        <TouchableOpacity
          onPress={() => NavigationService.goBack()}
          style={{flexDirection: 'row'}}>
          <Back
            props={props}
            onPress={() => NavigationService.goBack()}
            style={{marginLeft: 20}}
          />
        </TouchableOpacity>
        <TextNormal
          props={props}
          text={t('property.createTitle')}
          style={[
            containerStyle.textHeader,
            {color: colors.textBlue, textAlignVertical: 'center'},
          ]}
        />
        <TouchableOpacity
          onPress={() => {}}
          style={{flexDirection: 'row', marginEnd: 20}}>
          <TextNormal
            props={props}
            text={'        '}
            style={[
              containerStyle.textContent,
              {color: colors.textBlue, textAlignVertical: 'center'},
            ]}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[{backgroundColor: colors.pinkBackground, flex: 1}]}>
      <StatusBar barStyle={colorsApp.statusBar} />
      <SafeAreaView>
        {renderHeader()}
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <View style={{paddingEnd: 20, paddingLeft: 20, paddingBottom: 100}}>
            <TextInputFlat
              onChangeText={(text) => {
                setRoomName(text);
              }}
              text={t('property.title')}
              props={props}
              style={style.fieldItem}
            />
            <TextInputFlat
              onChangeText={(text) => {
                setCategory(text);
              }}
              text={t('chat.category')}
              props={props}
              style={style.fieldItem}
            />
            <TextInputFlat
              onChangeText={(text) => {
                setNote(text);
              }}
              text={t('chat.note')}
              props={props}
              style={style.fieldItem}
            />
            <TextInputFlat
              onChangeText={(text) => {
                setTags(text);
              }}
              text={t('chat.tag')}
              props={props}
              style={style.fieldItem}
            />
            {/* <TextInputFlat
              onChangeText={(text) => {
                setPassword(text);
              }}
              text={'Password (if you really limit joiner)'}
              props={props}
              style={style.fieldItem}
            /> */}
            <GradientButton
              text={t('common.confirm')}
              onPress={() => onCreateLivestream()}
              style={{marginTop: 20}}
            />
          </View>
        </KeyboardAwareScrollView>
        {isLoading ? <Loading /> : null}
      </SafeAreaView>
    </View>
  );
};

export default withTheme(InformationRoom);
