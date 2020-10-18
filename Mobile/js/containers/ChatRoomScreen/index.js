/* eslint-disable react-native/no-inline-styles */
import { firebase } from '@react-native-firebase/database';
import { useObserver } from 'mobx-react';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StatusBar, TouchableOpacity, View, Platform, Alert } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { withTheme } from 'react-native-paper';
import { useNavigationParam } from 'react-navigation-hooks';
import { FirebaseService } from '../../api/FirebaseService';
import { NavigationService } from '../../navigation';
import Back from '../../shared/components/Icons/Back';
import Loading from '../../shared/components/Loading';
import IALocalStorage from '../../shared/utils/storage/IALocalStorage';
import ModalActionSheet from '../../shared/components/Modal/ModalActionSheet';
import { ToastHelper } from '../../shared/components/ToastHelper';
import TopUserItem from '../../shared/components/TopUserItem';
import Constant from '../../shared/utils/constant/Constant';
import { StringHelper } from '../../shared/utils/helper/stringHelper';
import icons from '../../shared/utils/icons/icons';
import ImagePicker from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SPACINGS } from '../../themes';
import { containerStyle } from '../../themes/styles';
import { styles } from './styles';
import { uploadFileToFireBase } from '../../shared/utils/firebaseStorageUtils';
import AxiosFetcher from '../../api/AxiosFetch';
import ModalPingMessage from '../../shared/components/Modal/ModalPinMessage';
import { ScreenWidth } from '../../shared/utils/dimension/Divices';
import { Base64 } from 'js-base64';
import { useStores } from '../../store/useStore';
import { ScreenNames } from '../../route/ScreenNames';
import { colors } from '../../shared/utils/colors/colors';
import TextNormal from '../../shared/components/Text/TextNormal';

var uuid = require('uuid');
let childTemp = '';
let ownerTemp = {};
let toUserTemp = {};
const ChatRoomScreen = (props) => {
  const { colorsApp } = props.theme;
  const { userStore } = useStores();
  const { t } = useTranslation();
  const toUserData = useNavigationParam('toUserData');
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [msg, setMsg] = useState('');
  const [messagesList, setMessagesList] = useState([]);
  const [user] = useState('');
  const [userDetail, setUserDetail] = useState('');
  const [block, setBlock] = useState(false);
  const [deleteFr, setDeleteFr] = useState(false);
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

  const participants = [];

  const [child, setChild] = useState('');
  // Standard data user
  const [owner, setOwner] = useState({});
  const [toUser, setToUser] = useState({});

  const notifyToUserId = (idOwner, id, nameOwner) => {
    AxiosFetcher({
      method: 'POST',
      url: 'user/' + idOwner + '/sendNotification',
      data: {
        // messageType: 'NOTIFICATION',
        // message: `You have a message ${nameOwner ? 'from ' + nameOwner : ''}`,
        // receiverUserId: id,
        "fromUserAvatar": "",
        "fromUserId": idOwner,
        "fromUserName": nameOwner,
        "message": `You have a new message ${nameOwner ? 'from ' + nameOwner : ''}#MESSAGE`,
        "receiverUserId": id
      },
      hasToken: true,
    })
      .then((val) => { })
      .catch(() => {
        ToastHelper.showError(
          'Opps, error while trying to touch your recipient wake up but failed. Dont worry, message still has been sent successful',
        );
      });
  };

  const standardlizeParticipiants = async () => {
    if (toUserData) {
      let toUserDetail = toUserData;
      let me = userStore?.userInfo;
      setUserDetail(me);
      await setOwner(me);
      await setToUser(toUserDetail);

      ownerTemp = {
        id: me?.userId,
        name: me?.name,
        avatar: me?.avatar,
      };
      toUserTemp = toUserDetail;
      console.log(JSON.stringify(toUserTemp));
      participants[0] = toUser?.userId;
      participants[1] = owner?.userId;

      let child = StringHelper.generateDoccumentId(me?.id, toUserDetail?.id);
      await IALocalStorage.setRoom(toUserDetail?.name || '');
      setChild(child);
      childTemp = child;
      getMessages(child);
    }

    getMessages(child);
  };

  useEffect(() => {
    standardlizeParticipiants();
    props?.navigation.addListener('willFocus', () => {
      getInfoItem();
    });
  }, []);

  const getInfoItem = async () => {
    // const userInfoId = await IALocalStorage.getUserInfo();
    // AxiosFetcher({
    //   method: 'GET',
    //   data: undefined,
    //   url: `/api/person/${userInfoId?.id}/itemsuser`,
    //   hasToken: true,
    // })
    //   .then(async (val) => {
    //     userStore.setItemsBag(val || []);
    //   })
    //   .catch(() => { });
  };

  const getMessages = async (child) => {
    if (!child) {
      return;
    }
    setIsLoading(true);
    await firebase
      .database()
      .ref(Constant.SCHEMA.MESSAGES)
      .child(child)
      .on('value', (snapshot) => {
        setIsLoading(false);
        const data = snapshot.val();
        data &&
          setMessagesList(data?.messages?.filter((item) => item !== null));
      });
    setIsLoading(false);
  };

  const _renderHeader = () => {
    let item = toUserTemp;
    return (
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => NavigationService.goBack()}
          style={{ flexDirection: 'row' }}>
          <Back props={props} />
        </TouchableOpacity>
        <TopUserItem onItemPress={() => { }} item={item} />
        <TouchableOpacity
          onPress={() => {

            // AxiosFetcher({
            //   method: 'POST',
            //   url: 'user/' + userDetail?.id + '/sendNotification',
            //   data: {
            //     "fromUserAvatar": "",
            //     "fromUserId": userDetail?.id,
            //     "fromUserName": userDetail?.name,
            //     "message": JSON.stringify({
            //       messageType: 'VIDEO_CALL',
            //       message: `You have a new video calling ${userDetail?.name}`,
            //       receiverUserId: toUserTemp?.id,

            //     }),
            //     "receiverUserId": toUserTemp?.id
            //   },
            //   hasToken: true,
            // })
            //   .then((val) => {
                
            //   })
            //   .catch(() => {
            //     ToastHelper.showError(
            //       'Opps, error while trying to touch your recipient wake up but failed. Dont worry, video call request still has been sent successful',
            //     );
            //   });
              NavigationService.navigate(ScreenNames.VideoCall, { item, userDetail, toUserTemp })
          }}
          style={{
            width: 50,
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            alignContent: 'flex-end',
          }}>
          <TextNormal text="Call" />
        </TouchableOpacity>
      </View>
    );
  };

  const onSend = (messages = [], image) => {
    if (
      !image &&
      messages.length > 0 &&
      messages[0]?.text.replace(' ', '') === ''
    ) {
      return;
    }
    messages[0] = {
      _id: uuid.v4(),
      ...messages[0],
      userId: userDetail?.id,
      timeInMillosecond: new Date().getTime(),
      createdAt: moment().utc().format('YYYY-MM-DDTHH:mm:ssZ'),
      createdOn: moment().format("YYYY-MM-DD'T'HH:mm:ssZ"),
      modifiedOn: moment().format("YYYY-MM-DD'T'HH:mm:ssZ"),
      text: messages[0]?.text?.trim(),
      type: 'text',
      image: image,
      toUserId: toUserTemp?.id,
      toUserDetail: {
        id: toUserTemp?._id || toUserTemp?.id,
        name: toUserTemp?.name || '',
        avatar: toUserTemp?.avatar || Constant.MOCKING_DATA.ANY_AVATAR,
      },
      user: {
        name: userDetail?.name || '',
        avatar: userDetail?.avatar || Constant.MOCKING_DATA.ANY_AVATAR,
        _id: userDetail?.id,
      },
    };

    // set state messsage list
    const msgs = GiftedChat.append(messagesList, messages);
    setMessagesList(msgs);

    // add participant if empty
    let tempParticipiant = [];

    tempParticipiant.push({
      typing: false,
      avatar: userDetail?.avatar || Constant.MOCKING_DATA.ANY_AVATAR,
      deletedAt: '',
      userId: userDetail?.id,
      name: userDetail?.name || '',
    });
    tempParticipiant.push({
      typing: false,
      avatar:
        toUserTemp && toUserTemp?.avatar
          ? toUserTemp?.avatar
          : Constant.MOCKING_DATA.ANY_AVATAR,
      deletedAt: '',
      userId: toUserTemp ? toUserTemp?.id : '',
      name: toUserTemp ? toUserTemp?.name : '',
    });

    // set data send to server
    const data = {
      messages: msgs,
      participants: tempParticipiant,
      lastMessage: messages[0],
    };
    if (childTemp === '' || childTemp.includes('undefined')) {
      childTemp = StringHelper.generateDoccumentId(
        userDetail?.id,
        toUserTemp?.id,
      );
    }
    console.log(JSON.stringify(childTemp));
    if (childTemp === '' || childTemp.includes('undefined')) {
      alert('Something wrong. Please go back again');
      return;
    }

    try {
      FirebaseService.pushNewItemWithChildKey(
        Constant.SCHEMA.MESSAGES,
        childTemp,
        data,
      );
      notifyToUserId(userDetail?.id, toUserTemp?.id, userDetail?.name);
      return;
    } catch (err) {
      console.log('err' + err?.message);
    }
  };

  const renderSend = (props) => {
    return (
      <TouchableOpacity
        style={{ marginLeft: SPACINGS.large }}
        onPress={() => {
          props.onSend({ text: props.text });
          setMsg('');
        }}>
        {icons.IC_SEND_MSG}
      </TouchableOpacity>
    );
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
        setIsLoading(true);
        Promise.resolve(uploadFileToFireBase(response, user?.id))
          .then((val) => {
            let messages = [
              {
                _id: uuid.v4(),
                userId: userDetail?.id,
                timeInMillosecond: new Date().getTime(),
                createdAt: moment().utc().format('YYYY-MM-DDTHH:mm:ssZ'),
                createdOn: moment().format("YYYY-MM-DD'T'HH:mm:ssZ"),
                modifiedOn: moment().format("YYYY-MM-DD'T'HH:mm:ssZ"),
                text: msg,
                image: val,
                type: 'image',
                toUserId: toUserTemp?.id,
                toUserDetail: {
                  id: toUserTemp?.id,
                  name: toUserTemp?.name || '',
                  avatar:
                    toUserTemp?.avatar || Constant.MOCKING_DATA.ANY_AVATAR,
                },
                user: {
                  name: userDetail?.name || '',
                  avatar:
                    userDetail?.avatar || Constant.MOCKING_DATA.ANY_AVATAR,
                  _id: user?.userId,
                },
              },
            ];

            onSend(messages, val);
            setIsLoading(false);
          })
          .catch((error) => {
            console.log(error.message);
            ToastHelper.showError(t('error.common'));
            setIsLoading(false);
          });
      }
    });
  };
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
        Promise.resolve(uploadFileToFireBase(response, user?.id))
          .then((val) => {
            let messages = [
              {
                _id: uuid.v4(),
                userId: userDetail?.id,
                timeInMillosecond: new Date().getTime(),
                createdAt: moment().utc().format('YYYY-MM-DDTHH:mm:ssZ'),
                createdOn: moment().format("YYYY-MM-DD'T'HH:mm:ssZ"),
                modifiedOn: moment().format("YYYY-MM-DD'T'HH:mm:ssZ"),
                text: msg,
                image: val,
                type: 'image',
                toUserId: toUserTemp?.id,
                toUserDetail: {
                  id: toUserTemp?.id,
                  name: toUserTemp?.name || '',
                  avatar:
                    toUserTemp?.avatar || Constant.MOCKING_DATA.ANY_AVATAR,
                },
                user: {
                  name: userDetail?.name || '',
                  avatar:
                    userDetail?.avatar || Constant.MOCKING_DATA.ANY_AVATAR,
                  _id: userDetail?.id,
                },
              },
            ];

            onSend(messages, val);
            setIsLoading(false);
          })
          .catch((error) => {
            console.log(error.message);
            ToastHelper.showError(t('error.common'));
            setIsLoading(false);
          });
      }
    });
  };
  const renderAvatarInput = () => {
    return (
      <View style={styles.avatarSendContainer}>
        <TouchableOpacity
          onPress={() => checkImage()}
          style={{ padding: 5, zIndex: 10 }}>
          <Ionicons name="ios-images" color={colors.black_rect} size={30} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ marginLeft: SPACINGS.default, zIndex: 10 }}
          onPress={() => checkCamera()}>
          <Ionicons name="ios-camera" color={colors.black_rect} size={30} />
        </TouchableOpacity>
      </View>
    );
  };
  const checkCamera = () => {
    openCamera();
  };
  const checkImage = () => {
    openImagePicker();
  };
  return useObserver(() => (
    <View style={[containerStyle.default]}>
      <StatusBar barStyle={colorsApp.statusBar} />
      <View style={styles.content}>
        <View style={styles.topView} />
        {_renderHeader()}
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          extraHeight={100}
          contentContainerStyle={{
            flex: 1,
            width: '100%',
            height: '100%',
            backgroundColor: 'white',
          }}>
          <GiftedChat
            messages={messagesList}
            text={msg}
            onInputTextChanged={(text) => setMsg(text)}
            onSend={(messages) => onSend(messages)}
            user={{
              _id: userDetail?.id,
              avatar: userDetail?.avatar,
              name: userDetail?.name,
            }}
            listViewProps={{ initialNumToRender: 10 }}
            alwaysShowSend={true}
            primaryStyle={styles.primaryInputToolBarStyle}
            textInputStyle={styles.textInputStyle}
            textStyle={styles.textSendStyle}
            dateFormat={'ddd LT'}
            imageStyle={{ backgroundColor: 'white' }}
            imageProps={{ backgroundColor: 'white' }}
            renderSend={renderSend}
            renderAvatarInput={Platform.OS === 'ios' ? renderAvatarInput : null}
          // minComposerHeight={30}
          />
          {Platform.OS === 'android' ? renderAvatarInput() : null}
        </KeyboardAwareScrollView>
      </View>
      {isLoading ? <Loading /> : null}
    </View>
  ));
};

export default withTheme(ChatRoomScreen);
