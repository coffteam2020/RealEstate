import React, { Component } from 'react';
import { Platform, StyleSheet, View, Keyboard } from 'react-native';
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

    RNCallKeep.endAllCalls();
    this.sessionEventHandlers = {
      connectionCreated: event => {
        this.setState({ connected: [...this.state.connected, event?.connectionId] }, () => {
        })
      },
      connectionDestroyed: event => {
        this.setState({ connected: this.state.connected?.filter(a => a !== event?.connectionId) }, () => {
          if (this.state.connected.length <= 0) {
            NavigationService.goBack();
            return;
          }
        })
      },
      sessionConnected: event => {

      },
      sessionDisconnected: event => {
       
      },
      sessionReconnected: event => {
      },
    };
  }
  getTime = (k) => {
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
      let a = url?.split("%%");
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
                    })
                    
                  } else {
                    ToastHelper.showError('Oops! ❌')
                    NavigationService.goBack();
                  }
                })
                .catch(() => {
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
    },
  };


  render() {
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