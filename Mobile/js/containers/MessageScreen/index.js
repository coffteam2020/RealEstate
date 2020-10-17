import {firebase} from '@react-native-firebase/database';
import {useObserver} from 'mobx-react';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Alert,
  FlatList,
  StatusBar,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native';
import {withTheme} from 'react-native-paper';
import Swipeout from 'react-native-swipeout';
import Back from '../../shared/components/Icons/Back';
import Loading from '../../shared/components/Loading';
import TextNormal from '../../shared/components/Text/TextNormal';
import TextInputFlatLeftIconTouchable from '../../shared/components/TextInput/TextInputFlatLeftIconTouchable';
import {colors} from '../../shared/utils/colors/colors';
import Constant from '../../shared/utils/constant/Constant';
import icons from '../../shared/utils/icons/icons';
import {useStores} from '../../store/useStore';
import {containerStyle} from '../../themes/styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Empty from '../../shared/components/Empty';
import {styles} from './style';
import {RefreshControl} from 'react-native';
import IALocalStorage from '../../shared/utils/storage/IALocalStorage';
import AxiosFetcher from '../../api/AxiosFetch';
import {ToastHelper} from '../../shared/components/ToastHelper';
import {NavigationService} from '../../navigation';
import MessageItem from '../../shared/components/MessageItem/index';
import {ScreenNames} from '../../route/ScreenNames';
import HeaderFull from '../../shared/components/Header/HeaderFull';

const MessageScreen = (props) => {
  const {colorsApp} = props.theme;
  const {t} = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [messagesList, setMessagesList] = useState([]);
  const [messagesTList, setMessagesTList] = useState([]);
  const [searchText, setSearchText] = useState('');
  const {userStore} = useStores();
  const [currentUser, setCurrentUser] = useState('');

  useEffect(() => {
    // getUserInfo();
    IALocalStorage.getDetailUserInfo().then(async (val) => {
      let res = val;
      setCurrentUser(res);
      getMessages(res);
    });
  }, []);
  const getUserInfo = async () => {
    let userInfoId = await IALocalStorage.getUserInfo();
    let token = await IALocalStorage.getTokenUserInfo();
    AxiosFetcher({
      method: 'GET',
      data: undefined,
      url: '/api/person/' + userInfoId?.id,
      hasToken: true,
      token: token,
    })
      .then(async (val) => {
        await IALocalStorage.setDetailUserInfo(val);
        userStore.setUserInfo(val);
      })
      .catch(() => {
        ToastHelper.showError(
          'Could not get your information, please try again',
        );
      });
  };

  const getMessages = async () => {
    let user = await IALocalStorage.getDetailUserInfo();
    setIsLoading(true);
    await firebase
      .database()
      .ref(Constant.SCHEMA.MESSAGES)
      .on('value', (snapshot) => {
        const data = snapshot.val() ? Object.values(snapshot.val()) : [];
        let dataFilter = [];
        for (let i = 0; i < data.length; i++) {
          let lastMessage = data[i]?.lastMessage;
          if (
            lastMessage?.user?._id === user?.id ||
            lastMessage?.toUserDetail?.id === user?.id
          ) {
            dataFilter.push(lastMessage);
          }
        }
        setMessagesList(dataFilter || []);
        setMessagesTList(dataFilter || []);
        userStore.messages = dataFilter;
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      });
  };

  const onSearchText = (text) => {
    setSearchText(text);
    const dataFilter = messagesList;
    if (text && text != '') {
      userStore.setMessages(
        dataFilter.filter((item) =>
          item?.toUserDetail?.name?.toLowerCase().includes(text?.toLowerCase()),
        ),
      );
    } else {
      userStore.setMessages(messagesTList);
    }
  };

  const _renderHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => NavigationService.goBack()}
          style={{flexDirection: 'row'}}>
          <Back props={props} />
        </TouchableOpacity>
        <TextNormal
          props={props}
          text={t('message.title')}
          style={[containerStyle.textHeader, {color: colors.textBlue}]}
        />
        <TouchableOpacity
          onPress={() => {
            NavigationService.navigate(ScreenNames.AddFriendScreen);
          }}
          style={{flexDirection: 'row'}}>
          {icons.IC_ADD_FRIEND}
        </TouchableOpacity>
      </View>
    );
  };

  const renderMessageItem = (item, index) => {
    console.log(JSON.stringify(item));
    return (
      <Swipeout
        autoClose={true}
        rowId={index}
        backgroundColor={'transparent'}
        sectionId={1}
        style={{width: '100%'}}
        right={[
          {
            onPress: () => {
              Alert.alert(
                t('message.deleteMessage'),
                t('message.confirmDeleteMessage'),
                [
                  {
                    text: t('common.no'),
                  },
                  {
                    text: t('common.yes'),
                    onPress: () => {},
                  },
                ],
              );
            },
            text: t('question.delete'),
            type: 'delete',
          },
        ]}>
        <MessageItem
          onItemPress={async (item) => {
            let blocked = userStore.blockList || [];
            for (let i = 0; i < blocked.length; i++) {
              if (
                blocked[i]?.userId === item?.userId ||
                blocked[i]?.userId === item?.toUserDetail?.id
              ) {
                alert('This user has been blocked, you can not chat anymore');
                return;
              }
            }
            // Check if name is exist
            let userInfo = await IALocalStorage.getDetailUserInfo();
            NavigationService.navigate(ScreenNames.ChatRoomScreen, {
              toUserData: {
                id:
                  userInfo?.id === item?.toUserDetail?.id
                    ? item?.user?._id
                    : item?.toUserDetail?.id,
                avatar:
                  userInfo?.id === item?.toUserDetail?.id
                    ? item?.user?.avatar
                    : item?.toUserDetail?.avatar,
                name:
                  userInfo?.id === item?.toUserDetail?.id
                    ? item?.user?.name
                    : item?.toUserDetail?.name,
              },
            });
          }}
          item={item}
          index={index}
          currentUser={currentUser}
        />
      </Swipeout>
    );
  };

  const renderSeparator = () => {
    return <View style={styles.separatorView} />;
  };

  return useObserver(() => (
    <View style={[containerStyle.default]}>
      <StatusBar barStyle={colorsApp.statusBar} />
      <View style={styles.topView} />
      <SafeAreaView>
        <HeaderFull
          title={t('message.title')}
          onPress={() => {
            NavigationService.navigate(ScreenNames.LiveStream);
          }}
        />
        <TextInputFlatLeftIconTouchable
          hideText
          placeHolder={t('message.search')}
          props={props}
          // onChangeText={(text) => onSearchText(text)}
          value={searchText}
          style={styles.textInputHeader}
          textInputStyle={styles.textInputHeader}
        />
        {userStore?.messages?.length > 0 ? (
          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={false}
                onRefresh={() => getMessages()}
              />
            }
            showsVerticalScrollIndicator={false}
            data={userStore.messages.slice().sort(function (a, b) {
              return b?.timeInMillosecond - a?.timeInMillosecond;
            })}
            ItemSeparatorComponent={() => renderSeparator()}
            renderItem={({item, index}) => renderMessageItem(item, index)}
            keyExtractor={(item, index) => index + ''}
            style={styles.listMessages}
            // contentContainerStyle={styles.listMessages}
          />
        ) : (
          <Empty
            message={
              'No message history data chat. \nWanna chat with your friend 🤠? \nFollow them and give a shot try chat feature'
            }
          />
        )}
      </SafeAreaView>
      {isLoading ? <Loading /> : null}
    </View>
  ));
};

export default withTheme(MessageScreen);
