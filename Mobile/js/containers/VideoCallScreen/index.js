import React, { Component } from 'react';
import { View, NativeModules, Text, TouchableOpacity, Platform, Dimensions, Alert, Keyboard, Image, ImageBackground, Slider } from 'react-native';
import { RtcEngine, AgoraView } from 'react-native-agora';
import styles from './Styles';
import requestCameraAndAudioPermission from './permission';
import { withTheme, Modal } from 'react-native-paper';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { firebase } from '@react-native-firebase/database';
import LottieView from 'lottie-react-native';
import { NavigationService } from '../../navigation';
import { FirebaseService } from '../../api/FirebaseService';
import Constant from '../../shared/utils/constant/Constant';
import IALocalStorage from '../../shared/utils/storage/IALocalStorage';
import LogManager from '../../shared/utils/logging/LogManager';
import FastImage from 'react-native-fast-image';
import TextNormal from '../../shared/components/Text/TextNormal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import icons from '../../shared/utils/icons/icons';
import { containerStyle } from '../../themes/styles';
import { BackHandler } from 'react-native';
import { colors } from '../../shared/utils/colors/colors';
import ImagePicker, {launchImageLibrary} from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import { ScreenHeight, ScreenWidth } from '../../shared/utils/dimension/Divices';
import TextInputFlat from '../../shared/components/TextInput/TextInputFlat';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SPACINGS } from '../../themes';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import fonts from '../../shared/utils/fonts/fonts';
import { uploadFileToFireBase } from '../../shared/utils/firebaseStorageUtils';
import Loading from '../../shared/components/Loading';
import { ToastHelper } from '../../shared/components/ToastHelper';
import AxiosFetcher from '../../api/AxiosFetch';
import { useObserver } from 'mobx-react';
import * as ScreenshotDetector from 'react-native-screenshot-detect';
import ModalItem from '../../shared/components/Modal/ModalItem';
var uuid = require('uuid');


const { Agora } = NativeModules;            //Define Agora object as a native module
let keyRoom = '';
let dimensions = {                                            //get dimensions of the device to use in view styles
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};
const { FPS30,
  AudioProfileDefault,
  AudioScenarioDefault,
  Adaptative, } = Agora;                                  //Set defaults for Stream

const config = {                            //Setting config of the app
  appid: '3f1a0c97f4a84988a3c09718209ff267',               //Enter the App ID generated from the Agora Website
  channelProfile: 0,                        //Set channel profile as 0 for RTC
  videoEncoderConfig: {                     //Set Video feed encoder settings
    width: 720,
    height: 1080,
    bitrate: 1,
    frameRate: FPS30,
    orientationMode: Adaptative,
  },
  audioProfile: AudioProfileDefault,
  audioScenario: AudioScenarioDefault,
};
const IMAGE_CONFIG = {
  title: 'Pick image background for room',
  cancelButtonTitle: 'Cancel',
  takePhotoButtonTitle: 'Camera',
  chooseFromLibraryButtonTitle: 'Gallery',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};
const IMG = 'https://firebasestorage.googleapis.com/v0/b/stayalone-prod.appspot.com/o/blur.jpg?alt=media&token=23d5379e-8c8f-4f0b-8926-59811eeb9ce4';
// var isOwner = false;
var uid = Math.floor(Math.random() * 1000000);
var uudddd = 0;
class VideoCallScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      peerIds: [],                                       //Array for storing connected peers
      uid: uid,              //Generate a UID for local user
      appid: config.appid,
      vidMute: false,                             //State variable for Video Mute
      audMute: false,
      channelName: '',                        //Channel Name for the current session
      joinSucceed: false,
      showModalFilter: false,
      textChat: '',                     //State variable for storing success
      participiantsCount: 0,
      imgBackground: IMG,
      owner: {},
      like: -1,
      isOwner: false,
      showGift: false,
      gift: -1,
      messages: [],
      password: '',
      hasVol: true,
      hasVideo: true,
      isLoading: false,
      tags: [],
      showHeart: false,
      idForServer: '',
      keyboardShow: false,
      createdAt: new Date().getTime(),
      ranking: 0,
      filter: 0,
      contract: 1,
      light: 1,
      smooth: 1,
      red: 1,
      modalItem: false,
      modalAR: false,
      itemAR: -1,
    };
    if (Platform.OS === 'android') {                    //Request required permissions from Android
      requestCameraAndAudioPermission().then(_ => {
        console.log('requested!');
      });
    }
  }
  listenRoomChange = async (id) => {

    let userInfo = await IALocalStorage.getDetailUserInfo();
    firebase.database().ref(Constant.SCHEMA.LIVESTREAM).child(id).on('value', snapshot => {
      if (snapshot.val() != undefined) {
        let data = snapshot.val() || [];
        if (userInfo?.userId === data?.ownerUserId?.id) {
          this.setState({ isOwner: true });
        } else {
          this.setState({ isOwner: false });
        }
        this.setState({
          participiantsCount: data?.participiants?.length,
          messages: data?.messages || [],
          imgBackground: data?.backgroundImg || IMG,
          ranking: data?.ownerUserId?.ranking,
          hasVideo: data?.hasVideo || false,
          hasVol: data?.hasVol || false,
          roomId: data?.roomId,
          uid: data?.uid,

        }, () => {
          if ((data?.like || 0) !== this.state.like) {
            this.setState({
              like: data?.like,
              showHeart: data?.like !== this.state.like
            })
          }
          if ((data?.gift || 0) !== this.state.gift) {
            this.setState({
              gift: data?.gift,
              showGift: data?.gift !== this.state.gift
            })
          }
          if (this.state.isOwner && this.state.messages[this.state.messages.length - 1]?.data?.includes('has taken a screenshot')) {
            ToastHelper.showWarning(this.state.messages[this.state.messages.length - 1]?.data || 'Someone has taken a screenshot');
          }
        });

      }
    });
  }
  checkRoom = async () => {
    let curLiveStream = this.props.navigation.state.params?.curLiveStream;
    if (curLiveStream && curLiveStream?.ownerUserId) {
      uudddd = curLiveStream?.uid;
      // Mute mic, video, is currently being joiner
      this.setState({
        vidMute: true,
        audMute: true,
        uid: curLiveStream?.uid,
        channelName: curLiveStream?.channelName || curLiveStream?.ownerUserId,
        note: curLiveStream?.note || 'Hello, nice to meet ya all',
        imgBackground: curLiveStream?.backgroundImg || curLiveStream?.ownerUserId?.avatar || IMG,
        owner: curLiveStream?.ownerUserId
      });
      keyRoom = curLiveStream?.id;
      this.listenRoomChange(curLiveStream?.id);
    }

    // Create new room
    let userInfo = await IALocalStorage.getDetailUserInfo();
    let data = this.props.navigation?.state?.params?.data;
    if (data && data?.channelName) {
      // let convertChannelName = `${data?.channelName}_${userInfo?.userId}_${new Date().getTime()}`;
      this.setState({
        vidMute: true,
        audMute: false,
        tags: data?.tags || [],
        uid: userInfo?.userId,
        password: data?.password,
        channelName: data?.channelName,
        note: data?.note || 'Hello, nice to meet ya all',
        imgBackground: userInfo?.avatar,
        owner: {
          address: userInfo?.addressStr,
          id: userInfo?.userId,
          name: userInfo?.name,
          avatar: userInfo?.avatar
        }
      });
    }
    // this.listenRoomChange(keyRoom);
  }

  componentDidMount = async () => {
    BackHandler.addEventListener('hardwareBackPress', () => {
      //
    });
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => this._keyboardDidShow());
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => this._keyboardDidHide());
    let userInfo = await IALocalStorage.getDetailUserInfo();
    this.eventEmitter = ScreenshotDetector.subscribe(() => {
      this.onSendMessage(`Opps, ${userInfo?.name || 'I'} has taken a screenshot`);
    });

    // Unsubscribe later (a good place would be componentWillUnmount)
    // ScreenshotDetector.unsubscribe(this.eventEmitter)
    // Check join room existing
    this.checkRoom();

    // Init room
    this.configRoom();

    // After join success, 
    // Joiner: update participiant
    // Owner: create livestream to db
    this.checkActionForJoiner();

  }

  configRoom() {
    RtcEngine.on('userJoined', (data) => {
      const { peerIds } = this.state;                   //Get currrent peer IDs
      if (peerIds.indexOf(data?.uid) === -1) {           //If new user has joined
        this.setState({
          peerIds: [...peerIds, data?.uid],              //add peer ID to state array
        });
      }
    });
    RtcEngine.on('userOffline', (data) => {             //If user leaves
      this.setState({
        peerIds: this.state.peerIds.filter(uid => uid !== data.uid), //remove peer ID from state array
      });
    });
    RtcEngine.on('joinChannelSuccess', (data) => {                   //If Local user joins RTC channel
      RtcEngine.startPreview();                                      //Start RTC preview

    });
    RtcEngine.init(config);                                         //Initialize the RTC engine
    setTimeout(() => {
      this.startCall();
      setTimeout(() => {
        this.setState({
          joinSucceed: true,                                           //Set state variable to true
        });
      }, 500)
    }, 1500);
  }

  checkActionForJoiner = () => {
    let curLiveStream = this.props.navigation.state.params?.curLiveStream;
    if (curLiveStream && curLiveStream?.ownerUserId) {
      this.updateParticipiantsForLivestream(curLiveStream);
    } else {
      this.updateOwnerForLivestream();
    }
  }

  updateParticipiantsForLivestream = async (curLiveStream) => {
    RtcEngine.muteLocalAudioStream(true);
    RtcEngine.muteLocalVideoStream(true);
    let userInfo = await IALocalStorage.getDetailUserInfo();
    firebase.database().ref(Constant.SCHEMA.LIVESTREAM).orderByChild('id').equalTo(curLiveStream?.id).once('value', snapshot => {
      const dataWithKey = snapshot.val() || [];
      let key = Object.keys(dataWithKey)[0];
      let data = Object.values(dataWithKey)[0];
      let participiants = data?.participiants || [];
      var isFound = false;
      this.setState({ uid: parseInt(data?.uid), idForServer: data?.idForServer });
      for (let i = 0; i < participiants?.length; i++) {
        if (participiants[i].id === userInfo?.userId) {
          isFound = true;
        }
      }
      // If owner go back to room (by crashing app or killing app force)

      // If not found, append 
      if (!isFound) {
        let newJoiner = {
          id: userInfo?.userId,
          name: userInfo?.name,
          avatar: userInfo?.avatar,
          ranking: userInfo?.ranking,
          address: userInfo?.addressStr,
        };
        participiants.push(newJoiner);
        FirebaseService.updateItem(Constant.SCHEMA.LIVESTREAM, key, { ...data, participiants: participiants });
      }
      this.onSendMessage(`Hi everyone! Im ${userInfo?.name != null ? userInfo?.name : 'new_user'}. Nice to meet ya all!`);
    });

  };

  // Update data for livestreaming channel
  updateOwnerForLivestream = async () => {
    let userInfo = await IALocalStorage.getDetailUserInfo();
    let keyUser = `${userInfo?.userId}_${new Date().getTime()}`;
    keyRoom = keyUser;
    let tempObjRoom = {
      id: keyUser,
      uid: this.state.uid,
      channelName: this.state.channelName || (userInfo?.name !== null ? userInfo?.name : 'new_user'),
      backgroundImg: userInfo?.avatar,
      ownerUserId: {
        id: userInfo?.userId,
        name: userInfo?.name,
        avatar: userInfo?.avatar,
        address: userInfo?.addressStr,
        ranking: userInfo?.ranking,
      },
      createdAt: new Date().getTime(),
      startedAt: new Date().getTime(),
      password: this.state.password,
      hasVideo: this.state.hasVideo,
      hasVol: this.state.hasVol,
      tags: this.state.tags || [],
      participiants: [
        {
          id: userInfo?.userId,
          name: userInfo?.name,
          avatar: userInfo?.avatar,
          address: userInfo?.addressStr,
        }
      ],
      status: 'LIVESTREAMING',
    };
    FirebaseService.pushNewItemWithChildKey(Constant.SCHEMA.LIVESTREAM, keyUser, tempObjRoom);
    // RtcEngine.muteLocalVideoStream(true);
    this.listenRoomChange(keyUser);
    this.onSendMessage(`Hi everyone! Im ${userInfo?.name !== null ? userInfo?.name : 'new_user'}. Nice to meet ya all!`);
  };

  /**
  * @name startCall
  * @description Function to start the call
  */
  startCall = async () => {
    try {
      await RtcEngine.enableVideo();

      if (this.state.isOwner) {
        RtcEngine.joinChannel(this.state.channelName, this.state.uid);  //Join Channel	
      } else {
        let ran = Math.floor(Math.random() * 100);
        RtcEngine.joinChannel(this.state.channelName, ran);  //Join Channel
      }
      RtcEngine.enableAudio();                                        //Enable the audio
    } catch (err) {
    }
  }
  /**
  * @name endCall
  * @description Function to end the call
  */
  endCall = async () => {
    let userInfo = await IALocalStorage.getDetailUserInfo();
    firebase.database().ref(Constant.SCHEMA.LIVESTREAM).child(keyRoom).once('value', snapshot => {
      const data = snapshot.val() || [];
      if (userInfo?.userId === data?.ownerUserId?.id) {
        //Owner => update status
        let participiants = data?.participiants || [];
        participiants = participiants?.filter(item => item?.id != userInfo?.userId);
        FirebaseService.updateItem(Constant.SCHEMA.LIVESTREAM, keyRoom, { ...data, participiants: participiants, status: "END" });
      } else {
        // Not Owner => remove participiants
        let participiants = data?.participiants || [];
        participiants = participiants?.filter(item => item?.id != userInfo?.userId);
        FirebaseService.updateItem(Constant.SCHEMA.LIVESTREAM, keyRoom, { ...data, participiants: participiants });
      }
    });
    RtcEngine.leaveChannel();
    this.setState({
      peerIds: [],
      joinSucceed: false,
    });
    NavigationService.goBack();
  }
  /**
  * @name videoView
  * @description Function to return the view for the app
  */

  renderMultipleConnections = () => {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ height: dimensions.height * 3 / 4 - 50 }}>
          <AgoraView style={{ flex: 1 }}
            remoteUid={this.state.peerIds[0]} mode={1} key={this.state.peerIds[0]} />
        </View>
        <View style={{ height: dimensions.height / 4 }}>
          <ScrollView horizontal={true} decelerationRate={0}
            snapToInterval={dimensions.width / 2} snapToAlignment={'center'} style={{ width: dimensions.width, height: dimensions.height / 4 }}>
            {
              this.state.peerIds.slice(1).map((data) => (
                <TouchableOpacity style={{ width: dimensions.width / 2, height: dimensions.height / 4 }}
                  onPress={() => this.peerClick(data)} key={data}>
                  <AgoraView style={{ width: dimensions.width / 2, height: dimensions.height / 4 }}
                    remoteUid={data} mode={1} key={data} />
                </TouchableOpacity>
              ))
            }
          </ScrollView>
        </View>
      </View>
    );
  }
  renderCouple = () => {
    return (
      <View style={{ height: dimensions.height - 50 }}>
        <AgoraView style={{ flex: 1 }}
          remoteUid={this.state.peerIds[0]} mode={1} />
      </View>
    );
  }
  renderNoUsers = () => {
    return (
      <Text>No users connected</Text>
    );
  }

  showLocalVideo = () => {
    return (
      <AgoraView style={styles.localVideoStyle}
        zOrderMediaOverlay={true} showLocalVideo={true} mode={1} />
    );
  }
  renderHeader() {
    let channelName = this.state.channelName?.toString()?.split('_')[0];
    return (
      <View style={{ zIndex: 100, width: '100%' }}>
        <View style={styles.header}>
          <FastImage style={styles.avatar} resizeMode="cover" resizeMethod="resize" source={{ uri: this.state?.owner?.avatar || Constant.MOCKING_DATA.PLACE_HOLDER }} />
          <View style={{ marginLeft: 10 }}>
            <TextNormal numberOfLines={3} ellipsizeMode="tail" text={channelName?.trim() || ''} style={[containerStyle.textDefault, { color: colors.whiteBackground, width: '100%' }]} />
          </View>
        </View>
      </View>
    );
  }
  renderParticipiants = () => {
    return (
      <View style={styles.participiants}>
        <Ionicons name="ios-eye" size={25} color={'white'} />
        <TextNormal text={` ${this.state.participiantsCount || 0}`} style={[containerStyle.textDefault, { color: colors.whiteBackground, marginBottom: -10 }]} />

      </View>
    );
  }
  closeVideo = () => {
    if (this.state.isOwner) {
      Alert.alert('Hey', 'Do you want to stop livestreaming?', [
        {
          text: 'Yes, cancel',
          onPress: () => {
            this.onSendMessage('Hey everyone, Im leave now. Good bye!');
            setTimeout(() => {
              this.endCall();
            }, 4000);
          }
        },
        {
          text: 'No',
          onPress: () => { }
        }
      ]);
    } else {
      Alert.alert('Hey', 'Do you want to leave?', [
        {
          text: 'Yes, leave me',
          onPress: () => { this.endCall(); }
        },
        {
          text: 'No',
          onPress: () => { }
        }
      ]);
    }
  }
  renderCloseLiveStream = () => {
    return (
      <TouchableOpacity onPress={() => this.closeVideo()} style={styles.close}>
        <Ionicons name="ios-close" color={'white'} size={30} />
      </TouchableOpacity>
    );
  }
  renderMute = () => {
    if (!this.state.isOwner) {
      return;
    }
    return (
      <TouchableOpacity style={styles.noVol} onPress={async () => {
        let userInfo = await IALocalStorage.getDetailUserInfo();
        firebase.database().ref(Constant.SCHEMA.LIVESTREAM).child(keyRoom).once('value', snapshot => {
          const data = snapshot.val() || [];
          if (userInfo?.userId === data?.ownerUserId?.id) {
            RtcEngine.muteLocalAudioStream(!this.state.hasVol);
            firebase.database().ref(Constant.SCHEMA.LIVESTREAM).child(keyRoom).once('value', snapshot => {
              const data = snapshot.val() || [];
              // Not Owner => remove participiants
              FirebaseService.updateItem(Constant.SCHEMA.LIVESTREAM, keyRoom, { ...data, hasVol: !this.state.hasVol });
            });
            // this.setState({ hasVol: !this.state.hasVol }, () => {
            ToastHelper.showSuccess('You have reversed audio ' + (!this.state.hasVol ? 'remote to local' : 'local to remote'));
            // });
          }
        });

      }}>
        <Ionicons name={this.state.hasVol ? 'ios-volume-off' : 'ios-volume-high'} size={25} color={colors.white} />
      </TouchableOpacity>
    );
  }
  renderMuteVideo = () => {
    if (!this.state.isOwner) {
      return;
    }
    return (
      <TouchableOpacity style={styles.noVideo} onPress={async () => {
        let userInfo = await IALocalStorage.getDetailUserInfo();
        firebase.database().ref(Constant.SCHEMA.LIVESTREAM).child(keyRoom).once('value', snapshot => {
          const data = snapshot.val() || [];
          if (userInfo?.userId === data?.ownerUserId?.id) {
            RtcEngine.muteLocalVideoStream(!this.state.hasVideo);
            firebase.database().ref(Constant.SCHEMA.LIVESTREAM).child(keyRoom).once('value', snapshot => {
              const data = snapshot.val() || [];
              // Not Owner => remove participiants
              FirebaseService.updateItem(Constant.SCHEMA.LIVESTREAM, keyRoom, { ...data, hasVideo: !this.state.hasVideo });
            });
            // this.setState({ hasVideo: !this.state.hasVideo }, () => {
            ToastHelper.showSuccess('You have reversed video ' + (!this.state.hasVideo ? 'remote to local' : 'local to remote'));
            // });
          } else {
            alert('You have not permission to disable video call');
          }
        });

      }}>
        <MaterialCommunityIcons name={this.state.hasVideo ? 'video-outline' : 'video-off-outline'} size={25} color={colors.white} />
      </TouchableOpacity>
    );
  }
  renderFilter = () => {
    if (!this.state.isOwner) {
      return;
    }
    return (
      <TouchableOpacity style={[styles.noVideo, {
        left: '10%', flexDirection: 'column', width: 50,
        height: 50,
        top: 145,
      }]} onPress={async () => {
        this.setState({ showModalFilter: true })

      }}>
        <MaterialCommunityIcons name={'image-filter-vintage'} size={25} color={colors.white} />
        <TextNormal text={'Filter'} style={{ fontSize: 12, color: 'white' }} />
      </TouchableOpacity>
    );
  }
  renderaR = () => {
    if (!this.state.isOwner) {
      return;
    }
    return (
      <TouchableOpacity style={[styles.noVideo, {
        position: 'absolute', left: '30%', flexDirection: 'column', width: 50,
        height: 50,
        top: 145, zIndex: 1000
      }]} onPress={async () => {
        this.setState({ modalAR: true })

      }}>
        <MaterialCommunityIcons name={'image-filter-vintage'} size={25} color={colors.white} />
        <TextNormal text={'AR'} style={{ fontSize: 12, color: 'white' }} />

      </TouchableOpacity>
    );
  }
  renderImg = () => {
    if (this.state.itemAR >= 0) {
      return (
        <TouchableOpacity onPress={() => { this.setState({ itemAR: -1 }) }} style={{
          position: 'absolute', right: 60, flexDirection: 'column', width: 50,
          height: 50,
          top: this.state.itemAR === 1 ? 120 : this.state.itemAR === 2 ? 160 : 145, zIndex: 10000
        }}>
          <Image source={{ uri: this.state.itemAR === 0 ? 'https://creazilla-store.fra1.digitaloceanspaces.com/emojis/56996/cat-face-emoji-clipart-md.png' : this.state.itemAR === 2 ? 'https://i.pinimg.com/originals/eb/05/cb/eb05cbcdeb70fd3cff116437c5c75f19.png' : this.state.itemAR === 1 ? 'https://pngriver.com/wp-content/uploads/2018/04/Download-Transparent-Deer-Antlers-PNG.png' : '' }} style={[{ height: 70, backgroundColor: 'transparent', width: 80 },]} />
        </TouchableOpacity>
      )
    }
    return null;
  }
  renderBackground = () => {
    if (!this.state.isOwner) {
      return;
    }
    return (
      <TouchableOpacity style={[styles.noVideo, { left: '34%' }]} onPress={async () => {
        this.openImagePicker();

      }}>
        <MaterialCommunityIcons name={'camera-image'} size={25} color={colors.white} />
      </TouchableOpacity>
    );
  }
  openImagePicker = async () => {
    let userInfo = await IALocalStorage.getDetailUserInfo();
    launchImageLibrary(IMAGE_CONFIG, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        this.setState({ isLoading: true });
        Promise.resolve(uploadFileToFireBase(response, userInfo?.userId)).then(val => {
          this.setState({ isLoading: false });
          firebase.database().ref(Constant.SCHEMA.LIVESTREAM).child(keyRoom).once('value', snapshot => {
            const data = snapshot.val() || [];
            if (userInfo?.userId === data?.ownerUserId?.id) {

              FirebaseService.updateItem(Constant.SCHEMA.LIVESTREAM, keyRoom, { ...data, backgroundImg: val });
              ToastHelper.showSuccess('Change background image for room successful');
            }
          });
        }).catch(error => {
          this.setState({ isLoading: false });
          ToastHelper.showError('Could not change background image for channel');
        });
      }
    });
  };

  renderMessages = (item) => {
    let isOwner = item?.user?.id === this.state.owner?.id;
    return (
      <View style={styles.msgContainer}>
        <FastImage source={{ uri: item?.user?.avatar || Constant.MOCKING_DATA.PLACE_HOLDER }} style={[styles.avtChat, { borderColor: isOwner ? colors.yellow_fresh : colors.white }]} />
        <View style={{ flexWrap: 'wrap', alignSelf: 'baseline', maxWidth: '90%' }}>
          <TextNormal text={`${item?.user?.name} ${isOwner ? '- Host' : ''}`} style={[containerStyle.textContent, { color: isOwner ? colors.red : colors.white, marginLeft: 10 }]} />
          <TextNormal numberOfLines={1000} text={`${item?.data}`} style={[containerStyle.textDefault, { color: colors.whiteBackground, paddingLeft: 10 }]} />
        </View>
      </View>
    );
  }
  onSendMessage = async (text) => {
    let userInfo = await IALocalStorage.getDetailUserInfo();
    await firebase.database().ref(Constant.SCHEMA.LIVESTREAM).child(keyRoom).once('value', snapshot => {
      const data = snapshot.val() || [];
      let messages = data?.messages || [];
      messages = [...messages, ...[{
        id: uuid.v4(),
        user: {
          id: userInfo?.userId,
          name: userInfo?.name !== null ? userInfo?.name : 'new_user',
          avatar: userInfo?.avatar,
        },
        data: text ? text : this.state.textChat,
        type: 'text',
        createdAt: `${new Date().getTime()}`
      }]];
      FirebaseService.updateItem(Constant.SCHEMA.LIVESTREAM, keyRoom, { ...data, messages: messages });
      this.setState({ textChat: '' });
    });
  }
  renderInput = () => {
    return (
      <View style={styles.input}>
        <TextInput
          value={this.state.textChat}
          onChangeText={(text) => {
            this.setState({
              textChat: text
            });
          }}
          text={''}
          style={[styles.inputChat, { width: this.state.isOwner ? ScreenWidth * 0.7 : ScreenWidth * 0.7 }]}
        />
        <TouchableOpacity style={{
          zIndex: 10, height: ScreenHeight * 0.06,
          maxWidth: ScreenHeight * 0.06,
        }} onPress={() => {
          this.onSendMessage();
        }}>
          {icons.IC_SEND}
        </TouchableOpacity>

      </View>
    );
  }
  onSendItem = async (item) => {
    this.setState({ modalItem: false });
    let userInfoId = await IALocalStorage.getDetailUserInfo();
    let body = {
      'createdOn': new Date().getTime(),
      'fromUserAvatar': userInfoId?.avatar,
      'fromUserId': userInfoId?.userId,
      'fromUserName': userInfoId?.name || '',
      'itemType': 'GIFT',
      'itemCode': item?.itemCode,
      'message': '',
      'mediaUrl': item?.itemUrl,
      'messageType': 'GIFT',
      'receiverUserId': this.state.owner?.id,
    };
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow() {
    this.setState({ keyboardShow: true });
  }

  _keyboardDidHide() {
    this.setState({ keyboardShow: false });
  }
  render() {
    return (
      <View style={styles.max}>
        <KeyboardAwareScrollView keyboardShouldPersistTaps='handled' extraHeight={10} extraScrollHeight={20} contentContainerStyle={styles.max} scrollEnabled nestedScrollEnabled>
          {this.renderCloseLiveStream()}
          {this.renderInput()}
          {this.renderHeader()}
          {this.renderMute()}
          {/* {this.renderBackground()} */}
          {this.renderParticipiants()}
          <TouchableOpacity delayPressIn={0} style={{ zIndex: 1001, position: 'absolute', bottom: 50, right: 0, width: 80, height: 100 }} onPress={async () => {
            this.setState({ showHeart: true });
            await firebase.database().ref(Constant.SCHEMA.LIVESTREAM).child(keyRoom).once('value', snapshot => {
              const data = snapshot.val() || [];
              let like = data?.like || 0;
              like = like + 1;
              FirebaseService.updateItem(Constant.SCHEMA.LIVESTREAM, keyRoom, { ...data, like: like });
            })
          }}>
            <LottieView
              autoPlay
              loop={false}
              source={require('../../../assets/imgs/heart.json')}
            />
          </TouchableOpacity>
          <TouchableOpacity delayPressIn={0} style={{ zIndex: 1001, position: 'absolute', bottom: 50, left: 0, width: 80, height: 100 }} onPress={async () => {
            this.setState({ showGift: true });
            await firebase.database().ref(Constant.SCHEMA.LIVESTREAM).child(keyRoom).once('value', snapshot => {
              const data = snapshot.val() || [];
              let g = data?.gift || 0;
              g = g + 1;
              FirebaseService.updateItem(Constant.SCHEMA.LIVESTREAM, keyRoom, { ...data, gift: g });
            })
          }}>
            <LottieView
              autoPlay
              loop={false}
              source={require('../../../assets/imgs/gift.json')}
            />
          </TouchableOpacity>
          {this.state.showHeart ?
            <TouchableOpacity style={{ zIndex: 1000, position: 'absolute', top: ScreenHeight / 4, alignContent: 'center', alignItems: 'center', alignSelf: 'center', width: 400, height: 400, borderRadius: 200 }}>
              <LottieView
                autoPlay
                onAnimationFinish={() => { this.setState({ showHeart: false }) }}
                loop={false}
                source={require('../../../assets/imgs/center-heart.json')}
              />
            </TouchableOpacity> : null}
          {this.state.showGift ?
            <TouchableOpacity style={{ zIndex: 1000, position: 'absolute', top: ScreenHeight / 4, alignContent: 'center', alignItems: 'center', alignSelf: 'center', width: 400, height: 400, borderRadius: 200 }}>
              <LottieView
                autoPlay
                onAnimationFinish={() => { this.setState({ showGift: false }) }}
                loop={false}
                source={require('../../../assets/imgs/gift.json')}
              />
            </TouchableOpacity> : null}
          <ScrollView
            ref={ref => { this.scrollView = ref; }}
            onContentSizeChange={() => this.scrollView.scrollToEnd({ animated: true })}
            showsVerticalScrollIndicator={false} nestedScrollEnabled style={[styles.message, Platform.OS === 'android' && this.state.keyboardShow ? { height: ScreenHeight / 6 } : {}]}>
            {this.state.messages.map(item => {
              return (
                this.renderMessages(item)
              );
            })}

          </ScrollView>
          {this.state.joinSucceed ?
            (this.state.isOwner ?
              <AgoraView style={styles.localVideoStyle}
                zOrderMediaOverlay={false} showLocalVideo={true} mode={1} />
              /* <View style={{ zIndex: 5 }}>
                <View style={[styles.max, { zIndex: 2, backgroundColor: 'rgba(0,0,0,0.5)' }]}>
                </View>
              </View> */
              :
              (typeof parseInt(this.state.uid) === 'number' ? <AgoraView style={styles.localVideoStyle} showLocalVideo={false}
                mode={1} remoteUid={parseInt(this.state.uid) || 0} /> : null))
            : null}
          {/* {this.renderaR()} */}
          {this.renderImg()}
        </KeyboardAwareScrollView>
        {this.state.isLoading && <Loading />}

      </View>
    );
  }
}
export default withTheme(VideoCallScreen);
