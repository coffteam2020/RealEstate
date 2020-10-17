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

const InformationRoom = (props) => {
  const {colorsApp} = props.theme;
  const [isLoading] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [tags, setTags] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    TrackPlayer.stop();
  }, []);

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
        channelName: roomName,
        category,
        note,
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
          text={'Information'}
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
              text={'Title'}
              props={props}
              style={style.fieldItem}
            />
            <TextInputFlat
              onChangeText={(text) => {
                setCategory(text);
              }}
              text={'Category (Sport, Education ...)'}
              props={props}
              style={style.fieldItem}
            />
            <TextInputFlat
              onChangeText={(text) => {
                setNote(text);
              }}
              text={'Especially note (for individual, for my class, ...)'}
              props={props}
              style={style.fieldItem}
            />
            <TextInputFlat
              onChangeText={(text) => {
                setTags(text);
              }}
              text={'Tags (#gamefortoday, #playwithme ...)'}
              props={props}
              style={style.fieldItem}
            />
            <TextInputFlat
              onChangeText={(text) => {
                setPassword(text);
              }}
              text={'Password (if you really limit joiner)'}
              props={props}
              style={style.fieldItem}
            />
            <GradientButton
              text={'Create'}
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
