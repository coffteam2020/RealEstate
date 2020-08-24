import React, {Component} from 'react';
import {
  View,
  NativeModules,
  Text,
  TouchableOpacity,
  Platform,
  Dimensions,
  Alert,
  Keyboard,
  ImageBackground,
} from 'react-native';
import {RtcEngine, AgoraView} from 'react-native-agora';
import styles from './Styles';
import requestCameraAndAudioPermission from './permission';
import {withTheme} from 'react-native-paper';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import {firebase} from '@react-native-firebase/database';
import FastImage from 'react-native-fast-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ScreenshotDetector from 'react-native-screenshot-detect';
import {NavigationService} from '../../navigation';
import {FirebaseService} from '../../api/FirebaseService';
import {uploadFileToFireBase} from '../../shared/utils/firebaseStorageUtils';
import Constant from '../../shared/utils/constant/Constant';
import IALocalStorage from '../../shared/utils/storage/IALocalStorage';
import LogManager from '../../shared/utils/logging/LogManager';
import {ToastHelper} from '../../shared/components/ToastHelper';
import AxiosFetcher from '../../api/AxiosFetch';
import TextNormal from '../../shared/components/Text/TextNormal';
import {containerStyle} from '../../themes/styles';
import icons from '../../shared/utils/icons/icons';
import {ScreenWidth, ScreenHeight} from '../../shared/utils/dimension/Divices';
import Loading from '../../shared/components/Loading';
import {colors} from '../../shared/utils/colors/colors';
var uuid = require('uuid');

const {Agora} = NativeModules; //Define Agora object as a native module
let keyRoom = '';
let dimensions = {
  //get dimensions of the device to use in view styles
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};
const {FPS30, AudioProfileDefault, AudioScenarioDefault, Adaptative} = Agora; //Set defaults for Stream

const config = {
  //Setting config of the app
  appid: '5ab51eb1c25a446d85d6c42f2053e11d', //Enter the App ID generated from the Agora Website
  channelProfile: 0, //Set channel profile as 0 for RTC
  videoEncoderConfig: {
    //Set Video feed encoder settings
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
const IMG =
  'https://firebasestorage.googleapis.com/v0/b/stayalone-prod.appspot.com/o/blur.jpg?alt=media&token=23d5379e-8c8f-4f0b-8926-59811eeb9ce4';
// var isOwner = false;
var uid = Math.floor(Math.random() * 1000000);
var uudddd = 0;
class VideoCallScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      peerIds: [], //Array for storing connected peers
      uid: uid, //Generate a UID for local user
      appid: config.appid,
      vidMute: false, //State variable for Video Mute
      audMute: false,
      channelName: '', //Channel Name for the current session
      joinSucceed: false,
      textChat: '', //State variable for storing success
      participiantsCount: 0,
      imgBackground: IMG,
      owner: {},
      isOwner: false,
      messages: [],
      password: '',
      hasVol: true,
      hasVideo: true,
      isLoading: false,
      tags: [],
      idForServer: '',
      keyboardShow: false,
      createdAt: new Date().getTime(),
      ranking: 0,
      modalItem: false,
    };
    if (Platform.OS === 'android') {
      //Request required permissions from Android
      requestCameraAndAudioPermission().then((_) => {
        console.log('requested!');
      });
    }
  }
  listenRoomChange = async (id) => {
    let userInfo = await IALocalStorage.getDetailUserInfo();
    firebase
      .database()
      .ref(Constant.SCHEMA.LIVESTREAM)
      .child(id)
      .on('value', (snapshot) => {
        if (snapshot.val() != undefined) {
          let data = snapshot.val() || [];
          console.log(LogManager.parseJsonObjectToJsonString(data));
          if (userInfo?.id === data?.ownerUserId?.id) {
            this.setState({
              isOwner: true,
            });
          } else {
            this.setState({
              isOwner: false,
            });
          }
          this.setState(
            {
              participiantsCount: data?.participiants?.length,
              messages: data?.messages || [],
              imgBackground: data?.backgroundImg || IMG,
              ranking: data?.ownerUserId?.ranking,
            },
            () => {
              if (
                this.state.isOwner &&
                this.state.messages[
                  this.state.messages.length - 1
                ]?.data?.includes('has taken a screenshot')
              ) {
                ToastHelper.showWarning(
                  this.state.messages[this.state.messages.length - 1]?.data ||
                    'Someone has taken a screenshot',
                );
              }
              if (
                !this.state.isOwner &&
                this.state.messages[
                  this.state.messages.length - 1
                ]?.data?.includes('Hey everyone, Im leave now. Good bye!')
              ) {
                Alert.alert(
                  'Opps',
                  'Owner has cancelled livestreaming channel',
                  [
                    {
                      text: 'Leave me',
                      onPress: () => {
                        this.endCall();
                      },
                    },
                  ],
                );
                return;
              }
            },
          );
        }
      });
  };
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
        imgBackground:
          curLiveStream?.backgroundImg ||
          curLiveStream?.ownerUserId?.avatar ||
          IMG,
        owner: curLiveStream?.ownerUserId,
      });
      keyRoom = curLiveStream?.id;
      this.listenRoomChange(curLiveStream?.id);
    }

    // Create new room
    let userInfo = await IALocalStorage.getDetailUserInfo();
    let data = this.props.navigation.state.params.data;
    if (data && data?.channelName) {
      let convertChannelName = `${data?.channelName}_${
        userInfo?.id
      }_${new Date().getTime()}`;
      this.setState({
        vidMute: true,
		audMute: false,
		isOwner: true,
        tags: data?.tags || [],
        password: data?.password,
        channelName: convertChannelName,
        note: data?.note || 'Hello, nice to meet ya all',
        imgBackground: userInfo?.avatar,
        owner: {
          address: userInfo?.address,
          id: userInfo?.id,
          name: userInfo?.name,
          avatar: userInfo?.avatar,
        },
      });
    }
  };

  componentDidMount = async () => {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () =>
      this._keyboardDidShow(),
    );
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () =>
      this._keyboardDidHide(),
    );
    let userInfo = await IALocalStorage.getDetailUserInfo();
    this.eventEmitter = ScreenshotDetector.subscribe(() => {
      this.onSendMessage(
        `Opps, ${userInfo?.name || 'I'} has taken a screenshot`,
      );
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
  };

  configRoom() {
    RtcEngine.on('userJoined', (data) => {
      const {peerIds} = this.state; //Get currrent peer IDs
      if (peerIds.indexOf(data?.uid) === -1) {
        //If new user has joined
        this.setState({
          peerIds: [...peerIds, data?.uid], //add peer ID to state array
        });
      }
    });
    RtcEngine.on('userOffline', (data) => {
      //If user leaves
      this.setState({
        peerIds: this.state.peerIds.filter((uid) => uid !== data.uid), //remove peer ID from state array
      });
    });
    RtcEngine.on('joinChannelSuccess', () => {
      //If Local user joins RTC channel
      RtcEngine.startPreview(); //Start RTC preview
      this.setState({
        joinSucceed: true, //Set state variable to true
      });
    });
    RtcEngine.init(config); //Initialize the RTC engine
    setTimeout(() => {
      this.startCall();
    }, 1500);
  }

  checkActionForJoiner = () => {
    let curLiveStream = this.props.navigation.state.params?.curLiveStream;
    if (curLiveStream && curLiveStream?.ownerUserId) {
      this.updateParticipiantsForLivestream(curLiveStream);
    } else {
      this.updateOwnerForLivestream();
    }
  };

  updateParticipiantsForLivestream = async (curLiveStream) => {
    RtcEngine.muteLocalAudioStream(true);
    RtcEngine.muteLocalVideoStream(false);
    let userInfo = await IALocalStorage.getDetailUserInfo();
    firebase
      .database()
      .ref(Constant.SCHEMA.LIVESTREAM)
      .orderByChild('id')
      .equalTo(curLiveStream?.id)
      .once('value', (snapshot) => {
        const dataWithKey = snapshot.val() || [];
        let key = Object.keys(dataWithKey)[0];
        let data = Object.values(dataWithKey)[0];
        let participiants = data?.participiants || [];
        var isFound = false;
        this.setState({uid: data?.uid, idForServer: data?.idForServer});
        for (let i = 0; i < participiants?.length; i++) {
          if (participiants[i].id === userInfo?.id) {
            isFound = true;
          }
        }
        // If owner go back to room (by crashing app or killing app force)
        if (data?.ownerUserId?.id === userInfo?.id) {
          RtcEngine.muteLocalAudioStream(false);
        }
        // If not found, append
        if (!isFound) {
          let newJoiner = {
            id: userInfo?.id,
            name: userInfo?.name,
            avatar: userInfo?.avatar,
            ranking: userInfo?.ranking,
            address: userInfo?.addressStr,
          };
          participiants.push(newJoiner);
          FirebaseService.updateItem(Constant.SCHEMA.LIVESTREAM, key, {
            ...data,
            participiants: participiants,
          });
        }
        this.onSendMessage(
          `Hi everyone! Im ${
            userInfo?.name || 'new user'
          }. Nice to meet ya all!`,
        );
      });
  };

  // Update data for livestreaming channel
  updateOwnerForLivestream = async () => {
    console.log('updateOwnerForLivestream');
    let userInfo = await IALocalStorage.getDetailUserInfo();
    let keyUser = `${userInfo?.id}_${new Date().getTime()}`;
    keyRoom = keyUser;
    let tempObjRoom = {
      id: keyUser,
      uid: this.state.uid,
      channelName: this.state.channelName || userInfo?.name,
      backgroundImg: userInfo?.avatar,
      ownerUserId: {
        id: userInfo?.userId,
        name: userInfo?.name,
        avatar: userInfo?.avatar,
        address: userInfo?.address,
      },
      createdAt: new Date().getTime(),
      startedAt: new Date().getTime(),
      password: this.state.password,
      tags: this.state.tags || [],
      participiants: [
        {
          id: userInfo?.userId,
          name: userInfo?.name,
          avatar: userInfo?.avatar,
          address: userInfo?.addressStr,
        },
      ],
      status: 'LIVESTREAMING',
    };
    FirebaseService.pushNewItemWithChildKey(
      Constant.SCHEMA.LIVESTREAM,
      keyUser,
      tempObjRoom,
    );
    // RtcEngine.muteLocalVideoStream(true);
    this.listenRoomChange(keyUser);

    // Update to api server for ranking calculation
  };

  /**
   * @name startCall
   * @description Function to start the call
   */
  startCall = () => {
    try {
      console.log('isOwner ' + this.state.isOwner);
      if (this.state.isOwner) {
        RtcEngine.joinChannel(this.state.channelName, this.state.uid); //Join Channel
      } else {
        let ran = Math.floor(Math.random() * 100);
        RtcEngine.joinChannel(this.state.channelName, ran); //Join Channel
      }
      RtcEngine.enableAudio(); //Enable the audio
    } catch (err) {
      console.log(LogManager.parseJsonObjectToJsonString(err));
    }
  };
  /**
   * @name endCall
   * @description Function to end the call
   */
  endCall = async () => {
    console.log(keyRoom);
    let userInfo = await IALocalStorage.getDetailUserInfo();
    firebase
      .database()
      .ref(Constant.SCHEMA.LIVESTREAM)
      .child(keyRoom)
      .once('value', (snapshot) => {
        const data = snapshot.val() || [];
        if (userInfo?.userId === data?.ownerUserId?.id) {
          //Owner => update status
          let participiants = data?.participiants || [];
          participiants = participiants?.filter(
            (item) => item?.id != userInfo?.userId,
          );
          FirebaseService.updateItem(Constant.SCHEMA.LIVESTREAM, keyRoom, {
            ...data,
            participiants: participiants,
            status: 'END',
          });
        } else {
          // Not Owner => remove participiants
          let participiants = data?.participiants || [];
          participiants = participiants?.filter(
            (item) => item?.id != userInfo?.userId,
          );
          FirebaseService.updateItem(Constant.SCHEMA.LIVESTREAM, keyRoom, {
            ...data,
            participiants: participiants,
          });
        }
      });
    RtcEngine.leaveChannel();
    this.setState({
      peerIds: [],
      joinSucceed: false,
    });
    NavigationService.goBack();
  };
  /**
   * @name videoView
   * @description Function to return the view for the app
   */

  renderMultipleConnections = () => {
    return (
      <View style={{flex: 1}}>
        <View style={{height: (dimensions.height * 3) / 4 - 50}}>
          <AgoraView
            style={{flex: 1}}
            remoteUid={this.state.peerIds[0]}
            mode={1}
            key={this.state.peerIds[0]}
          />
        </View>
        <View style={{height: dimensions.height / 4}}>
          <ScrollView
            horizontal={true}
            decelerationRate={0}
            snapToInterval={dimensions.width / 2}
            snapToAlignment={'center'}
            style={{width: dimensions.width, height: dimensions.height / 4}}>
            {this.state.peerIds.slice(1).map((data) => (
              <TouchableOpacity
                style={{
                  width: dimensions.width / 2,
                  height: dimensions.height / 4,
                }}
                onPress={() => this.peerClick(data)}
                key={data}>
                <AgoraView
                  style={{
                    width: dimensions.width / 2,
                    height: dimensions.height / 4,
                  }}
                  remoteUid={data}
                  mode={1}
                  key={data}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  };
  renderCouple = () => {
    return (
      <View style={{height: dimensions.height - 50}}>
        <AgoraView
          style={{flex: 1}}
          remoteUid={this.state.peerIds[0]}
          mode={1}
        />
      </View>
    );
  };
  renderNoUsers = () => {
    return <Text>No users connected</Text>;
  };

  showLocalVideo = () => {
    return (
      <AgoraView
        style={styles.localVideoStyle}
        zOrderMediaOverlay={true}
        showLocalVideo={true}
        mode={1}
      />
    );
  };
  renderHeader() {
    let channelName = this.state.channelName?.split('_')[0];
    return (
      <View style={{zIndex: 10}}>
        <View style={styles.header}>
          <FastImage
            style={styles.avatar}
            resizeMode="contain"
            resizeMethod="resize"
            source={{
              uri:
                this.state.owner?.avatar || Constant.MOCKING_DATA.PLACE_HOLDER,
            }}
          />
          <View style={{marginLeft: 10}}>
            <TextNormal
              numberOfLines={1}
              ellipsizeMode="tail"
              text={channelName?.trim() || ''}
              style={[
                containerStyle.textDefault,
                {color: colors.whiteBackground},
              ]}
            />
          </View>
        </View>
      </View>
    );
  }
  renderParticipiants = () => {
    return (
      <View style={styles.participiants}>
        <Ionicons name="ios-eye" size={25} color={'white'} />
        <TextNormal
          text={` ${this.state.participiantsCount || 0}`}
          style={[
            containerStyle.textDefault,
            {color: colors.whiteBackground, marginBottom: -5},
          ]}
        />
      </View>
    );
  };
  closeVideo = () => {
    if (this.state.isOwner) {
      Alert.alert('Hey', 'Do you want to stop livestreaming?', [
        {
          text: 'Yes, cancel',
          onPress: () => {
            this.onSendMessage('Hey everyone, Im leave now. Good bye!');
            setTimeout(() => {
              this.endCall();
            }, 1000);
          },
        },
        {
          text: 'No',
          onPress: () => {},
        },
      ]);
    } else {
      Alert.alert('Hey', 'Do you want to leave?', [
        {
          text: 'Yes, leave me',
          onPress: () => {
            this.endCall();
          },
        },
        {
          text: 'No',
          onPress: () => {},
        },
      ]);
    }
  };
  renderCloseLiveStream = () => {
    return (
      <TouchableOpacity onPress={() => this.closeVideo()} style={styles.close}>
        <Ionicons name="ios-close" color={'white'} size={30} />
      </TouchableOpacity>
    );
  };
  renderMute = () => {
    if (!this.state.isOwner) {
      return;
    }
    return (
      <TouchableOpacity
        style={styles.noVol}
        onPress={async () => {
          let userInfo = await IALocalStorage.getDetailUserInfo();
          firebase
            .database()
            .ref(Constant.SCHEMA.LIVESTREAM)
            .child(keyRoom)
            .once('value', (snapshot) => {
              const data = snapshot.val() || [];
              if (userInfo?.id === data?.ownerUserId?.id) {
                RtcEngine.muteLocalAudioStream(!this.state.hasVol);
                this.setState({hasVol: !this.state.hasVol}, () => {
                  ToastHelper.showSuccess(
                    'You have reversed audio ' +
                      (this.state.hasVol
                        ? 'remote to local'
                        : 'local to remote'),
                  );
                });
              }
            });
        }}>
        <Ionicons
          name={this.state.hasVol ? 'ios-volume-off' : 'ios-volume-high'}
          size={25}
          color={colors.white}
        />
      </TouchableOpacity>
    );
  };
  renderMuteVideo = () => {
    if (!this.state.isOwner) {
      return;
    }
    return (
      <TouchableOpacity
        style={styles.noVideo}
        onPress={async () => {
          let userInfo = await IALocalStorage.getDetailUserInfo();
          firebase
            .database()
            .ref(Constant.SCHEMA.LIVESTREAM)
            .child(keyRoom)
            .once('value', (snapshot) => {
              const data = snapshot.val() || [];
              if (userInfo?.id === data?.ownerUserId?.id) {
                RtcEngine.muteLocalVideoStream(!this.state.hasVideo);
                this.setState({hasVideo: !this.state.hasVideo}, () => {
                  ToastHelper.showSuccess(
                    'You have reversed video ' +
                      (this.state.hasVideo
                        ? 'remote to local'
                        : 'local to remote'),
                  );
                });
              } else {
                alert('You have not permission to disable video call');
              }
            });
        }}>
        <MaterialCommunityIcons
          name={this.state.hasVideo ? 'video-outline' : 'video-off-outline'}
          size={25}
          color={colors.white}
        />
      </TouchableOpacity>
    );
  };
  renderBackground = () => {
    if (!this.state.isOwner) {
      return;
    }
    return (
      <TouchableOpacity
        style={[styles.noVideo, {left: '34%'}]}
        onPress={async () => {
          this.openImagePicker();
        }}>
        <MaterialCommunityIcons
          name={'camera-image'}
          size={25}
          color={colors.white}
        />
      </TouchableOpacity>
    );
  };
  openImagePicker = async () => {
    let userInfo = await IALocalStorage.getDetailUserInfo();
    ImagePicker.showImagePicker(IMAGE_CONFIG, (response) => {
      // console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        this.setState({isLoading: true});
        Promise.resolve(uploadFileToFireBase(response, userInfo?.id))
          .then((val) => {
            this.setState({isLoading: false});
            firebase
              .database()
              .ref(Constant.SCHEMA.LIVESTREAM)
              .child(keyRoom)
              .once('value', (snapshot) => {
                const data = snapshot.val() || [];
                if (userInfo?.id === data?.ownerUserId?.id) {
                  FirebaseService.updateItem(
                    Constant.SCHEMA.LIVESTREAM,
                    keyRoom,
                    {...data, backgroundImg: val},
                  );
                  ToastHelper.showSuccess(
                    'Change background image for room successful',
                  );
                }
              });
          })
          .catch((error) => {
            console.log(error.message);
            this.setState({isLoading: false});
            ToastHelper.showError(
              'Could not change background image for channel',
            );
          });
      }
    });
  };

  renderMessages = (item) => {
    let isOwner = item?.user?.id === this.state.owner?.id;
    return (
      <View style={styles.msgContainer}>
        <FastImage
          source={{
            uri: item?.user?.avatar || Constant.MOCKING_DATA.PLACE_HOLDER,
          }}
          style={[
            styles.avtChat,
            {borderColor: isOwner ? colors.yellow_fresh : colors.white},
          ]}
        />
        <View
          style={{flexWrap: 'wrap', alignSelf: 'baseline', maxWidth: '90%'}}>
          <TextNormal
            text={`${item?.user?.name} ${isOwner ? '- Host' : ''}`}
            style={[
              containerStyle.textContent,
              {color: isOwner ? colors.red : colors.white, marginLeft: 10},
            ]}
          />
          <TextNormal
            numberOfLines={1000}
            text={`${item?.data}`}
            style={[
              containerStyle.textDefault,
              {color: colors.white, paddingLeft: 10},
            ]}
          />
        </View>
      </View>
    );
  };
  onSendMessage = async (text) => {
    let userInfo = await IALocalStorage.getDetailUserInfo();
    await firebase
      .database()
      .ref(Constant.SCHEMA.LIVESTREAM)
      .child(keyRoom)
      .once('value', (snapshot) => {
        const data = snapshot.val() || [];
        let messages = data?.messages || [];
        messages = [
          ...messages,
          ...[
            {
              id: uuid.v4(),
              user: {
                id: userInfo?.id,
                name: userInfo?.name,
                avatar: userInfo?.avatar,
              },
              data: text ? text : this.state.textChat,
              type: 'text',
              createdAt: `${new Date().getTime()}`,
            },
          ],
        ];
        FirebaseService.updateItem(Constant.SCHEMA.LIVESTREAM, keyRoom, {
          ...data,
          messages: messages,
        });
        this.setState({textChat: ''});
      });
  };
  renderInput = () => {
    return (
      <View style={styles.input}>
        <TextInput
          value={this.state.textChat}
          onChangeText={(text) => {
            this.setState({
              textChat: text,
            });
          }}
          text={''}
          style={[
            styles.inputChat,
            {
              width: ScreenWidth * 0.7
            },
          ]}
        />
        <TouchableOpacity
          style={{
            zIndex: 10,
            height: ScreenHeight * 0.06,
            maxWidth: ScreenHeight * 0.06,
          }}
          onPress={() => {
            this.onSendMessage();
          }}>
          {icons.IC_SEND}
        </TouchableOpacity>
      </View>
    );
  };
  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow() {
    this.setState({keyboardShow: true});
  }

  _keyboardDidHide() {
    this.setState({keyboardShow: false});
  }
  render() {
    console.log(
      Platform.OS + '' + parseInt(uudddd) + '__' + this.state.isOwner,
    );
    return (
      <View style={styles.max}>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          extraHeight={10}
          extraScrollHeight={20}
          contentContainerStyle={styles.max}
          scrollEnabled
          nestedScrollEnabled>
          <ImageBackground
            style={[styles.max, {zIndex: -1}]}
            source={{uri: this.state.imgBackground || IMG}}>
            {this.renderHeader()}
            {this.renderMute()}
            {this.renderMuteVideo()}
            {this.renderBackground()}
            {this.renderParticipiants()}
            {this.renderCloseLiveStream()}
            <View
              style={[
                styles.max,
                {zIndex: 0, backgroundColor: 'rgba(0,0,0,0.5)'},
              ]}>
              <ScrollView
                ref={(ref) => {
                  this.scrollView = ref;
                }}
                onContentSizeChange={() =>
                  this.scrollView.scrollToEnd({animated: true})
                }
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled
                style={[
                  styles.message,
                  Platform.OS === 'android' && this.state.keyboardShow
                    ? {height: ScreenHeight / 6}
                    : {},
                ]}>
                {this.state.messages.map((item) => {
                  return this.renderMessages(item);
                })}
              </ScrollView>
            </View>
          </ImageBackground>
          {this.renderInput()}
          {this.state.hasVideo && this.state.isOwner ? (
            <AgoraView
              style={styles.localVideoStyle}
              zOrderMediaOverlay={true}
              showLocalVideo={true}
              mode={1}
            />
          ) : !this.state.isOwner &&
            this.state.joinSucceed &&
            typeof parseInt(this.state.uid) === 'number' ? (
            <AgoraView
              style={styles.localVideoStyle}
              showLocalVideo={false}
              mode={1}
              remoteUid={parseInt(this.state.uid)}
            />
          ) : null}
        </KeyboardAwareScrollView>
        {this.state.isLoading && <Loading />}
      </View>
    );
  }
}
export default withTheme(VideoCallScreen);
