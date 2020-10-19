import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, StatusBar, PermissionsAndroid, Platform } from 'react-native';
import JitsiMeet, { JitsiMeetView } from 'react-native-jitsi-meet';
import { NavigationService } from '../../navigation';
import TextNormal from '../../shared/components/Text/TextNormal';
import { ToastHelper } from '../../shared/components/ToastHelper';
import IALocalStorage from '../../shared/utils/storage/IALocalStorage';
import Entypo from 'react-native-vector-icons/Entypo';
import QRCode from 'react-native-qrcode-svg';
import Device from 'react-native-device-info';
import Webview from 'react-native-webview';
import { ScreenHeight, ScreenWidth } from '../../shared/utils/dimension/Divices';
import AxiosFetcher from '../../api/AxiosFetch';
import { useStores } from '../../store/useStore';


const VideoCall = (props) => {
  const [showJitsi, setShowJitsi] = useState(true);
  const isGroup = props?.navigation.state.params.isGroup || false;
  const newUrl = props?.navigation.state.params.url;

  const item = props?.navigation.state.params.item
  const toUserTemp = props?.navigation.state.params.toUserTemp
  const [url, setUrl] = useState('');
  const [time, setTime] = useState(0);
  const [qr, setQR] = useState('dsa');
  const [qrs, setQRs] = useState(false);
  const [ty, setTy] = useState(`00:01`);
  const { userStore } = useStores();
  var t = `${new Date().getTime()}`.substring(3, 8);
  let interval = undefined;
  let a = 0;
  useEffect(() => {
    // if (isGroup) {
    interval = setInterval(() => {
      a = a + 1;
      if (a > (isGroup ? 3600 : 1800)) {
        clearInterval(interval);
        NavigationService.goBack();
      } else {
        setTime(a);
        setTy(getTime(a));
      }
    }, 1000)
    // }
    setTimeout(() => {
      t = `${userStore.userInfo?.name?.replace(" ", "")}_${t}`;
      const url = 'https://meet.jit.si/' + t;
      var o = '';
      if (newUrl) {
        o = newUrl;
        setUrl(newUrl);
      } else {
        o = url;
        setUrl(`${url}`);
      }
      const userInfo = {
        displayName: userStore.userInfo?.name,
        email: userStore.userInfo?.email,
        avatar: userStore.userInfo?.avatar,
      };
      if (item) {
        notifyToUserId(userStore?.userInfo?.id, item?.id, userStore?.userInfo?.name, url);
      }
      JitsiMeet.call(o, userInfo);
    }, 1000);

    return () => {
      JitsiMeet.endCall();
      clearInterval(interval);
    };
  }, []);

  const notifyToUserId = (idOwner, id, nameOwner, url) => {
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

  const onConferenceWillJoin = () => { }
  const onConferenceTerminated = () => {
    clearInterval(interval);
    NavigationService.goBack()
  }

  const onConferenceJoined = () => {
    if (Platform.OS === 'android') {
      setShowJitsi(false);
      setTimeout(() => {
        setShowJitsi(true)
      }, 100)
    }
  };
  const getTime = (k) => {
    console.log(k);
    const h = Math.round(k / 60);
    const m = k < 60 ? k : Math.round(k - (h * 60));
    console.log(`${h < 10 ? ('0' + h) : h}:${m < 10 ? ('0' + m) : m}`);
    return `${h < 10 ? ('0' + h) : h}:${m < 10 ? ('0' + m) : m}`
  }
  return (
    <>
      {
        <View style={{ position: 'absolute', padding: 3, backgroundColor: 'red', borderRadius: 10, top: 50, right: 10, zIndex: 100 }}>
          <TextNormal text={`${ty}`} style={{ color: 'white' }} />
        </View>}
      {isGroup ?
        <TouchableOpacity onPress={() => { setQRs(true) }} style={{ position: 'absolute', padding: 5, borderColor: 'white', borderWidth: 1, borderRadius: 40, top: 50, right: 80, zIndex: 100 }}>
          <Entypo name="share" color={'white'} size={25} />
        </TouchableOpacity> : null}
      {qr && qr !== "" && qrs &&
        <TouchableOpacity onPress={() => { setQRs(false) }} style={{ borderRadius: 2, borderColor: 'white', borderWidth: 3, position: 'absolute', justifyContent: 'center', top: ScreenHeight / 3, left: ScreenWidth / 4, zIndex: 100, alignContent: 'center', alignItems: 'center' }}>
          <QRCode value={`${url || 'das'}`} size={200} />
        </TouchableOpacity>}
      {showJitsi && <JitsiMeetView
        onConferenceWillJoin={onConferenceWillJoin}
        onConferenceTerminated={onConferenceTerminated}
        onConferenceJoined={onConferenceJoined}
        style={{ flex: 1, height: '100%', width: '100%', backgroundColor: 'black' }}
      />}
    </>
  )
}

export default VideoCall;