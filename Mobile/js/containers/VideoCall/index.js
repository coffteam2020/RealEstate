// // import React, { useEffect, useState } from 'react';
// // import { TouchableOpacity, View, StatusBar, PermissionsAndroid, Platform } from 'react-native';
// // import JitsiMeet, { JitsiMeetView } from 'react-native-jitsi-meet';
// // import { NavigationService } from '../../navigation';
// // import TextNormal from '../../shared/components/Text/TextNormal';
// // import { ToastHelper } from '../../shared/components/ToastHelper';
// // import IALocalStorage from '../../shared/utils/storage/IALocalStorage';
// // import Entypo from 'react-native-vector-icons/Entypo';
// // import QRCode from 'react-native-qrcode-svg';
// // import Device from 'react-native-device-info';
// // import Webview from 'react-native-webview';
// // import { ScreenHeight, ScreenWidth } from '../../shared/utils/dimension/Divices';
// // import AxiosFetcher from '../../api/AxiosFetch';
// // import { useStores } from '../../store/useStore';


// // const VideoCall = (props) => {
// //   const [showJitsi, setShowJitsi] = useState(true);
// //   const isGroup = props?.navigation.state.params.isGroup || false;
// //   const newUrl = props?.navigation.state.params.url;

// //   const item = props?.navigation.state.params.item
// //   const toUserTemp = props?.navigation.state.params.toUserTemp
// //   const [url, setUrl] = useState('');
// //   const [time, setTime] = useState(0);
// //   const [qr, setQR] = useState('dsa');
// //   const [qrs, setQRs] = useState(false);
// //   const [ty, setTy] = useState(`00:01`);
// //   const { userStore } = useStores();
// //   var t = `${new Date().getTime()}`.substring(3, 8);
// //   let interval = undefined;
// //   let a = 0;
// //   useEffect(() => {
// //     // if (isGroup) {
// //     interval = setInterval(() => {
// //       a = a + 1;
// //       if (a > (isGroup ? 3600 : 1800)) {
// //         clearInterval(interval);
// //         NavigationService.goBack();
// //       } else {
// //         setTime(a);
// //         setTy(getTime(a));
// //       }
// //     }, 1000)
// //     // }
// //     setTimeout(() => {
// //       t = `${userStore.userInfo?.name?.replace(" ", "")}_${t}`;
// //       const url = 'https://meet.jit.si/' + t;
// //       var o = '';
// //       if (newUrl) {
// //         o = newUrl;
// //         setUrl(newUrl);
// //       } else {
// //         o = url;
// //         setUrl(`${url}`);
// //       }
// //       const userInfo = {
// //         displayName: userStore.userInfo?.name,
// //         email: userStore.userInfo?.email,
// //         avatar: userStore.userInfo?.avatar,
// //       };
// //       if (item) {
// //         notifyToUserId(userStore?.userInfo?.id, item?.id, userStore?.userInfo?.name, url);
// //       }
// //       JitsiMeet.call(o, userInfo);
// //     }, 1000);

// //     return () => {
// //       JitsiMeet.endCall();
// //       clearInterval(interval);
// //     };
// //   }, []);

// //   const notifyToUserId = (idOwner, id, nameOwner, url) => {
// //     AxiosFetcher({
// //       method: 'POST',
// //       url: 'user/' + idOwner + '/sendNotification',
// //       data: {
// //         "fromUserAvatar": "",
// //         "fromUserId": idOwner,
// //         "fromUserName": nameOwner,
// //         "message": `You have a new video call from ${nameOwner ? 'from ' + nameOwner : ''}#VIDEO_CALL#${url}`,
// //         "receiverUserId": id
// //       },
// //       hasToken: true,
// //     })
// //       .then((val) => { })
// //       .catch(() => {
// //         ToastHelper.showError(
// //           'Opps, error while trying to touch your recipient wake up but failed. Dont worry, message still has been sent successful',
// //         );
// //       });
// //   };

// //   const onConferenceWillJoin = () => { }
// //   const onConferenceTerminated = () => {
// //     clearInterval(interval);
// //     NavigationService.goBack()
// //   }

// //   const onConferenceJoined = () => {
// //     if (Platform.OS === 'android') {
// //       setShowJitsi(false);
// //       setTimeout(() => {
// //         setShowJitsi(true)
// //       }, 100)
// //     }
// //   };
// //   const getTime = (k) => {
// //     console.log(k);
// //     const h = Math.round(k / 60);
// //     const m = k < 60 ? k : Math.round(k - (h * 60));
// //     console.log(`${h < 10 ? ('0' + h) : h}:${m < 10 ? ('0' + m) : m}`);
// //     return `${h < 10 ? ('0' + h) : h}:${m < 10 ? ('0' + m) : m}`
// //   }
// //   return (
// //     <>
// //       {
// //         <View style={{ position: 'absolute', padding: 3, backgroundColor: 'red', borderRadius: 10, top: 50, right: 10, zIndex: 100 }}>
// //           <TextNormal text={`${ty}`} style={{ color: 'white' }} />
// //         </View>}
// //       {isGroup ?
// //         <TouchableOpacity onPress={() => { setQRs(true) }} style={{ position: 'absolute', padding: 5, borderColor: 'white', borderWidth: 1, borderRadius: 40, top: 50, right: 80, zIndex: 100 }}>
// //           <Entypo name="share" color={'white'} size={25} />
// //         </TouchableOpacity> : null}
// //       {qr && qr !== "" && qrs &&
// //         <TouchableOpacity onPress={() => { setQRs(false) }} style={{ borderRadius: 2, borderColor: 'white', borderWidth: 3, position: 'absolute', justifyContent: 'center', top: ScreenHeight / 3, left: ScreenWidth / 4, zIndex: 100, alignContent: 'center', alignItems: 'center' }}>
// //           <QRCode value={`${url || 'das'}`} size={200} />
// //         </TouchableOpacity>}
// //       {showJitsi && <JitsiMeetView
// //         onConferenceWillJoin={onConferenceWillJoin}
// //         onConferenceTerminated={onConferenceTerminated}
// //         onConferenceJoined={onConferenceJoined}
// //         style={{ flex: 1, height: '100%', width: '100%', backgroundColor: 'black' }}
// //       />}
// //     </>
// //   )
// // }

// // export default VideoCall;

import React, { Component } from 'react';
import { Platform, StyleSheet, View, ScrollView, Alert, Keyboard } from 'react-native';
import Axios from 'axios';
import { OTSession, OTPublisher, OTSubscriber, OT } from 'opentok-react-native';
import { TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Share from 'react-native-share';
import { NavigationService } from '../../navigation';
import AxiosFetcher from '../../api/AxiosFetch';
import { firebase } from '@react-native-firebase/messaging';
import Entypo from 'react-native-vector-icons/Entypo';
import { ScreenHeight, ScreenWidth } from '../../shared/utils/dimension/Divices';
import QRCode from 'react-native-qrcode-svg';
import { ToastHelper } from '../../shared/components/ToastHelper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Loading from '../../shared/components/Loading';
import IALocalStorage from '../../shared/utils/storage/IALocalStorage';
import TextNormal from '../../shared/components/Text/TextNormal';
import RNCallKeep from 'react-native-callkeep';
export default class VideoCall extends Component {
  constructor(props) {
    super(props);
    this.apiKey = '46964724';
    // this.sessionId = '1_MX40Njk2NDcyNH5-MTYwMzQ4MDY1MjI4NH5uTmxkdENkQkNjNUdNMy9Xa0wzWmNpNjV-fg';
    // this.token = 'T1==cGFydG5lcl9pZD00Njk2NDcyNCZzaWc9MjRmZTQ4MGQ3MDBlMGYxZGM1Mjc2MTJmNGU2YzhlOWE2ZjhlZGQwNjpzZXNzaW9uX2lkPTFfTVg0ME5qazJORGN5Tkg1LU1UWXdNelE0TURZMU1qSTROSDV1VG14a2RFTmtRa05qTlVkTk15OVhhMHd6V21OcE5qVi1mZyZjcmVhdGVfdGltZT0xNjAzNDgwNjYzJm5vbmNlPTAuNzQ1ODQ4MTYwMzU4MDkwNyZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNjA2MDc2MjYyJmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9';
    this.state = {
      sessionId: undefined,
      token: undefined,
      connected: [],
      mute: false,
      muteVideo: false,
      qr: '_',
      videoSource: 'screen',
      camera: 'front',
      num: 0,
      numT: '',
      loading: false,
      isVersing: false,
      showQRS: false,
    }
    this.num = 0;
    this.interval = undefined;

    // console.log(JSON.stringify(this.props));
    RNCallKeep.endAllCalls();
    this.sessionEventHandlers = {
      connectionCreated: event => {
        // console.log("connection created", event);
        this.setState({ connected: [...this.state.connected, event?.connectionId] }, () => {
          // console.log(this.state.connected.length);
        })
      },
      connectionDestroyed: event => {
        // console.log("connection destroyed", event);
        // console.log(this.state.connected.length);
        this.setState({ connected: this.state.connected?.filter(a => a !== event?.connectionId) }, () => {
          if (this.state.connected.length <= 0) {
            NavigationService.goBack();
            return;
          }
        })
      },
      sessionConnected: event => {

        console.log("Client connect to a session")
      },
      sessionDisconnected: event => {
        console.log("Client disConnect to a session")
        // if (this.state.connected.length <= 1) {
        //   NavigationService.goBack();
        //   return;
        // }
      },
      sessionReconnected: event => {
        console.log("session reconnected")
      },
    };
  }
  getTime = (k) => {
    // console.log(k);
    const h = Math.floor(k / 60);
    const m = k - h * 60;
    return `${h < 10 ? ('0' + h) : h}:${m < 10 ? ('0' + m) : m}`
  }
  a = async (url) => {
    let a = await IALocalStorage.getDetailUserInfo();

    const item = this.props?.navigation?.state?.params?.item;
    if (item) {
      this.notifyToUserId(a.id, item?.id, a.name, url);
      setTimeout(() => {
        this.notifyToUserId(a.id, item?.id, a.name, url);
      }, 2000)
    }
  }

  notifyToUserId = (idOwner, id, nameOwner, url) => {
    AxiosFetcher({
      method: 'POST',
      url: 'user/' + idOwner + '/sendNotification',
      data: {
        "fromUserAvatar": "",
        "fromUserId": idOwner,
        "fromUserName": nameOwner,
        "message": `You have a new video call from ${nameOwner ? 'from ' + nameOwner : ''}#VIDEO_CALL#${url}`,
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
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  componentDidMount = async () => {
    Keyboard.dismiss();
    const isGroup = this.props.navigation?.state?.params?.isGroup
    // if (isGroup) {
    this.interval = setInterval(() => {
      this.num = this.num + 1;
      if (this.num > (isGroup ? 3600 : 1800)) {
        clearInterval(this.interval);
        NavigationService.goBack();
      } else {
        this.setState({ num: this.num, numT: this.getTime(this.num) });
      }
    }, 1000)
    // }
    const url = this.props.navigation?.state?.params?.url;
    const isNew = this.props.navigation?.state?.params?.isNew;
    if (url && url?.split('%%')?.length === 2) {
      // console.log("=======dasdasdasdas" + JSON.stringify(url?.split("%%")));
      let a = url?.split("%%");
      // console.log("=======dasdasdasdas" + a[0]);
      // console.log("=======dasdasdasdas" + a[1]);
      this.setState({
        sessionId: `${a[0]}`,
      })
      this.setState({
        token: `${a[1]}`
      })

    }
    this.setState({ videoSource: this.props.navigation?.state?.params?.source || 'camera' })
    if (!this.props.navigation?.state?.params?.url) {
      this.setState({ loading: true })
      AxiosFetcher({
        method: 'GET',
        url: 'tokbox/createsession',
        hasToken: true,
      })
        .then((val) => {
          this.setState({ loading: false })
          if (typeof val === 'string') {
            this.setState({
              sessionId: val
            }, () => {
              AxiosFetcher({
                method: 'GET',
                url: 'tokbox/generatetoken?sessionId=' + val,
                hasToken: true,
              })
                .then((val) => {
                  if (val) {
                    this.setState({
                      token: val,
                      qr: `${this.state.sessionId}%%${val}`
                    }, () => {
                      this.a(`${this.state.sessionId}%%${val}`);
                      // console.log("=======1" + JSON.stringify(this.state.qr));
                    })
                    // Alert.alert('Thông báo', 'Bạn muốn đổi camera hay chia sẻ màn hình?', [
                    //   {
                    //     text: 'Camera 📷',
                    //     onPress: () => {
                    //       this.setState({
                    //         videoSource: 'camera'
                    //       }, () => {

                    //       })
                    //     }
                    //   },
                    //   {
                    //     text: 'Screen 🖥',
                    //     onPress: () => {
                    //       this.setState({
                    //         videoSource: 'screen'
                    //       }, () => {
                    //         this.setState({
                    //           token: val,
                    //           qr: `${this.state.sessionId}%%${val}`
                    //         }, () => {
                    //           this.a(`${this.state.sessionId}%%${val}`);
                    //           console.log("=======1" + JSON.stringify(this.state.qr));
                    //         })
                    //       })
                    //     }
                    //   }
                    // ])

                  } else {
                    ToastHelper.showError('Oops! ❌')
                    NavigationService.goBack();
                  }
                })
                .catch(() => {
                  // setIsLoading(false);
                  // ToastHelper.showError(t('account.getInfoErr'));
                });
            })

          } else {
            ToastHelper.showError('Oops! ❌')
            NavigationService.goBack();
            this.setState({ loading: false })
          }
        })
        .catch(() => {
          this.setState({ loading: false })
          ToastHelper.showError('Oops! ❌')
          NavigationService.goBack();
        });
    }
  }
  subscriberEventHandler = {
    StreamDisconnected: (event) => {
    },
    videoDisabled: (event) => {
    },
    videoEnabled: (event) => {
    },
    videoDataReceived: (event) => {
    },
    videoNetworkStats: (event) => {
      //THIS IS FIRING
    },
    connected: (event) => {
      console.log(JSON.stringify(event));
      //THIS IS FIRING
      this.setState({
        connected: [...this.state.connected, event]
      })
    },
    disconnected: (event) => {
      //THIS IS NOT FIRING
    },
    error: (error) => {
      //console.log(There was an error with the subscriber: ${error});
    },
  };


  render() {
    // console.log(this.state)
    if (!this.state.sessionId || !this.state.token) {
      return (
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <TouchableOpacity
            style={{ position: 'absolute', top: Platform.OS === 'ios' ? 40 : 20, left: 20, zIndex: 10000, borderRadius: 70, backgroundColor: 'rgba(0,0,0,0.2)' }}
            onPress={() => {
              NavigationService.goBack();
            }}>
            <Ionicons name="md-chevron-back-outline" size={30} color={'white'} />
          </TouchableOpacity>
        </View>
      )
    }
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <TouchableOpacity onPress={() => { }} style={{ position: 'absolute', justifyContent: 'center', top: Platform.OS === 'android' ? 25 : 45, left: ScreenWidth / 2 - 20, zIndex: 100000, alignContent: 'center', alignItems: 'center' }}>
          <TextNormal style={{ color: 'white' }} text={`${this.state.numT}`} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ position: 'absolute', top: Platform.OS === 'ios' ? 40 : 20, left: 20, zIndex: 10000, borderRadius: 70, backgroundColor: 'rgba(0,0,0,0.2)' }}
          onPress={() => {
            NavigationService.goBack();
          }}>
          {<Ionicons name="md-chevron-back-outline" size={30} color={'white'} />}
        </TouchableOpacity>
        <TouchableOpacity
          style={{ position: 'absolute', top: Platform.OS === 'ios' ? 40 : 20, right: 20, zIndex: 10000, borderRadius: 70, backgroundColor: 'rgba(0,0,0,0.2)' }}
          onPress={() => {
            NavigationService.goBack();

          }}>
          {<Ionicons name="close" size={30} color={'red'} />}
        </TouchableOpacity>
        {this.props.navigation?.state?.params?.isGroup && <TouchableOpacity
          style={{ position: 'absolute', padding: 3, top: Platform.OS === 'ios' ? 40 : 20, right: 60, zIndex: 10000, borderRadius: 70, backgroundColor: 'rgba(0,0,0,0.2)' }}
          onPress={() => {
            this.setState({ showQRS: true })
          }}>
          <Entypo name="share" color={'white'} size={26} />
        </TouchableOpacity>}
        <TouchableOpacity
          style={{ position: 'absolute', padding: 3, top: Platform.OS === 'ios' ? 40 : 20, right: 100, zIndex: 10000, borderRadius: 70, backgroundColor: 'rgba(0,0,0,0.2)' }}
          onPress={() => {
            this.setState({ mute: !this.state.mute })
          }}>
          <Ionicons name={!this.state.mute ? "volume-mute-outline" : 'volume-medium-outline'} color={'white'} size={26} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ position: 'absolute', padding: 5, top: Platform.OS === 'ios' ? 80 : 60, right: 100, zIndex: 10000, borderRadius: 70, backgroundColor: 'rgba(0,0,0,0.2)' }}
          onPress={() => {
            this.setState({ muteVideo: !this.state.muteVideo })
          }}>
          <MaterialCommunityIcons name={!this.state.muteVideo ? "camera-off" : 'camera-outline'} color={'white'} size={22} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ position: 'absolute', padding: 7, top: Platform.OS === 'ios' ? 40 : 20, left: 60, zIndex: 10000, borderRadius: 70, }}
          onPress={() => {
            this.setState({ videoSource: this.state.videoSource === 'screen' ? 'camera' : 'screen', isVersing: !this.state.isVersing }, () => {
              // this.setState(this.state);
              // ToastHelper.showSuccess('Bắt đầu chia sẻ ...')
              // setTimeout(()=>{
              //   Alert.alert('Opps!', 'Thiết bị của bạn chưa được hỗ trợ để chia sẻ mượt, hãy thử thiết bị khác')
              // }, 3000);
            })
          }}>
          <MaterialCommunityIcons name={'monitor-share'} color={'white'} size={20} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ position: 'absolute', padding: 3, top: Platform.OS === 'ios' ? 40 : 20, left: 100, zIndex: 10000, borderRadius: 70, }}
          onPress={() => {
            this.setState({ camera: this.state.camera === 'front' ? 'back' : 'front' })
          }}>
          <Ionicons name={'camera-reverse-outline'} color={'white'} size={22} />
        </TouchableOpacity>
        <OTSession publishAudio={this.state.mute} publishVideo={this.state.muteVideo}  eventHandlers={this.sessionEventHandlers} apiKey={this.apiKey} sessionId={this.state.sessionId} token={this.state.token}>
          {
            !this.state.isVersing ?
              <View style={{ flexDirection: 'row', width: '100%', height: `100%`, zIndex: 1000 }}>
                {
                  <OTPublisher properties={{
                    videoSource: 'camera', cameraPosition: this.state.camera,
                    publishAudio: this.state.mute, publishVideo: this.state.muteVideo
                  }}  mute={this.state.mute} style={{ width: '100%', height: '100%', }} />
                }
              </View>
              :
              <OTSubscriber containerStyle={{
                borderRadius: 30, marginEnd: 15,
                width: '100%', height: '100%', flexDirection: 'row',
                padding: 10,
                paddingHorizontal: 5,
                zIndex: 1002, position: 'absolute', bottom: 0,
                left: 0
              }} style={{ width: '100%', height: '100%', zIndex: 1001, borderRadius: 30, }} />
          }
          {!this.state.isVersing ?
            <OTSubscriber containerStyle={{
              borderRadius: 30, marginEnd: 15,
              width: ScreenHeight * 0.18, height: '25%', flexDirection: 'row',
              padding: 10,
              paddingHorizontal: 5,
              zIndex: 1001, position: 'absolute', bottom: 0,
              left: 0
            }} style={{ width: '100%', height: '100%', zIndex: 1001, borderRadius: 30, }} /> :
            <View style={{ flexDirection: 'row', width: '100%', height: `100%`, zIndex: 1000 }}>
            {
              <OTPublisher properties={{
                videoSource: 'camera', cameraPosition: this.state.camera,
                publishAudio: this.state.mute, publishVideo: this.state.muteVideo
              }}  publishAudio={this.state.mute} publishVideo={this.state.muteVideo} mute={this.state.mute} 
              containerStyle={{
                borderRadius: 30, marginEnd: 15,
                width: ScreenHeight * 0.18, height: '25%', flexDirection: 'row',
                padding: 10,
                paddingHorizontal: 5,
                zIndex: 1002, position: 'absolute', bottom: 0,
                left: 0
              }} style={{ width: '100%', height: '100%', zIndex: 1001, borderRadius: 30, }} />
            }
          </View>
          }
        </OTSession>
        {this.state.qr && this.state.qr !== "_" && this.state.showQRS &&
          <View onPress={() => { this.setState({ showQRS: false }) }} style={{ backgroundColor: 'white', padding: 5, borderRadius: 2, borderColor: 'white', borderWidth: 3, position: 'absolute', justifyContent: 'center', top: ScreenHeight / 3, left: ScreenWidth / 4, zIndex: 10000, alignContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => {
              this.setState({ showQRS: false })
            }}>
              <QRCode value={`${this.state.qr || '_'}`} size={200} />
            </TouchableOpacity>
            <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between' }} onPress={async () => {
              const shareOptions = {
                title: '💡',
                message: this.state.qr,
                failOnCancel: false,
              };

              // If you want, you can use a try catch, to parse
              // the share response. If the user cancels, etc.
              try {
                await Share.open(shareOptions);
              } catch (error) {
                console.log('Error =>', error);
              }
            }}>
              <TextNormal numberOfLines={1} text={`${this.state.qr}`} style={{ width: 150 }} />
              <Ionicons name={'share-outline'} color={'black'} size={25} />
            </TouchableOpacity>
          </View>}
        {this.state.loading && <Loading />}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  publisherWrapperPortrait: {
    position: 'absolute',
    height: '27%',
    width: '28%',
    bottom: 5,
    left: 5,
    alignItems: 'center',
    backgroundColor: 'white',
    justifyContent: 'center',
  },
})
// import React, { Component } from 'react';
// import { View, Button } from 'react-native';
// import { OTSession, OTPublisher, OTSubscriber } from 'opentok-react-native';

// export default class App extends Component {
//   constructor(props) {
//     super(props);

//     //**** CHANGE ME
//     this.apiKey = '46964724';
//     this.sessionId = '2_MX40Njk2NDcyNH5-MTYwMzkwNzc5MjgwMn5Ua1hvR1FFVGRjc0FVb3NheVExRTBFM0l-UH4';
//     this.subscriberToken = 'T1==cGFydG5lcl9pZD00Njk2NDcyNCZzaWc9Mjc0YTc2OGRhNzAxMjdkNDliM2U1OGY0Y2FiY2E3OWZiODk3ODdlYTpzZXNzaW9uX2lkPTJfTVg0ME5qazJORGN5Tkg1LU1UWXdNemt3TnpjNU1qZ3dNbjVVYTFodlIxRkZWR1JqYzBGVmIzTmhlVkV4UlRCRk0wbC1VSDQmY3JlYXRlX3RpbWU9MTYwMzkwNzc5MyZub25jZT0xMTIxMzYwODI1JnJvbGU9cHVibGlzaGVyJmV4cGlyZV90aW1lPTE2MDM5OTQxOTM=';
//     this.publisherToken = 'T1==cGFydG5lcl9pZD00Njk2NDcyNCZzaWc9Mjc0YTc2OGRhNzAxMjdkNDliM2U1OGY0Y2FiY2E3OWZiODk3ODdlYTpzZXNzaW9uX2lkPTJfTVg0ME5qazJORGN5Tkg1LU1UWXdNemt3TnpjNU1qZ3dNbjVVYTFodlIxRkZWR1JqYzBGVmIzTmhlVkV4UlRCRk0wbC1VSDQmY3JlYXRlX3RpbWU9MTYwMzkwNzc5MyZub25jZT0xMTIxMzYwODI1JnJvbGU9cHVibGlzaGVyJmV4cGlyZV90aW1lPTE2MDM5OTQxOTM=';
//     //****

//     this.state = {
//       isPublisher: false,
//       token: this.subscriberToken
//     };

//     // Opentok handlers
//     this.sessionEventHandlers = {
//       error: error => {
//         console.log('Opentok session error', error);
//       },
//       sessionConnected: () => {
//         console.log('Opentok session connected');
//       },
//       sessionReconnected: () => {
//         console.log('Opentok session sessionReconnected');
//       },
//       sessionReconnecting: () => {
//         console.log('Opentok session sessionReconnecting...');
//       },
//       sessionDisconnected: () => {
//         console.log('Opentok session disconnected');
//       },
//       streamCreated: event => {
//         console.log('Opentok session stream created', event);
//       },
//       streamDestroyed: event => {
//         console.log('Opentok session stream streamDestroyed', event);
//       },
//       connectionCreated: event => {
//         console.log('Opentok session connectionCreated', event);
//       },
//       connectionDestroyed: event => {
//         console.log('Opentok session connectionCreated', event);
//       },
//       connectionCreated: () => {
//         console.log('Opentok session connectionCreated');
//       },
//       connectionCreated: () => {
//         console.log('Opentok session connectionCreated');
//       },
//       connectionCreated: () => {
//         console.log('Opentok session connectionCreated');
//       },
//       signal: event => {
//         console.log('Opentok session signal', event);
//       },
//     };

//     this.subscriberEventHandlers = {
//       error: (error) => {
//         console.log('Subscriber error', error);
//       }
//     };
//     this.publisherEventHandlers = {
//       error: (error) => {
//         console.log('Publisher error', error);
//       },
//       streamCreated: event => {
//         console.log('Publisher stream created!', event);
//       },
//       streamDestroyed: event => {
//         console.log('Publisher stream destroyed!', event);
//       }
//     };

//   }

//   togglePubSub = () => {
//     let _token = null;

//     if (this.state.isPublisher) {
//       _token = this.subscriberToken;
//     } else {
//       _token = this.publisherToken;
//     }

//     this.setState({
//       isPublisher: !this.state.isPublisher,
//       token: _token
//     });
//   }

//   render() {
//     if (this.state.isPublisher) {
//       console.log('I am currently a Publisher');
//     } else {
//       console.log('I am currently a Subscriber');
//     }

//     return (
//       <View style={{ flex: 1, flexDirection: 'row' }}>
//         <OTSession
//           apiKey={this.apiKey}
//           sessionId={this.sessionId}
//           token={this.state.token}
//           eventHandlers={this.sessionEventHandlers}>
//           {this.state.isPublisher
//             ? <OTPublisher style={{ width: 300, height: 300 }} eventHandlers={this.publisherEventHandlers} />
//             : <OTSubscriber style={{ width: 300, height: 300 }} eventHandlers={this.subscriberEventHandlers} />
//           }
//           {this.state.isPublisher ?
//           <OTSubscriber containerStyle={{
//             borderRadius: 30, marginEnd: 15,
//             width: '18%', height: '25%', flexDirection: 'row',
//             padding: 10,
//             paddingHorizontal: 5,
//             zIndex: 1001, position: 'absolute', bottom: 0,
//             left: 50
//           }} style={{ width: '100%', height: '100%', zIndex: 1001, borderRadius: 30, }} /> :
//           <OTPublisher containerStyle={{
//             borderRadius: 30, marginEnd: 15,
//             width: '18%', height: '25%', flexDirection: 'row',
//             padding: 10,
//             paddingHorizontal: 5,
//             zIndex: 1001, position: 'absolute', bottom: 0,
//             left: 50
//           }} style={{ width: '20%', height: '20%', zIndex: 1001, borderRadius: 30, }} />} 
//         </OTSession>
//         <View style={{ position: 'absolute', bottom: 100, left: 100, borderWidth: 1, borderColor: '#000' }}>
//           <Button
//             onPress={this.togglePubSub}
//             title={this.state.isPublisher ? 'Switch to subscriber' : 'Switch to publisher'}
//             color="#000"
//           />
//         </View>
//       </View>
//     );
//   }
// }