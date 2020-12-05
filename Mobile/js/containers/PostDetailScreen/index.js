import { useObserver } from 'mobx-react';
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  View,
  RefreshControl,
  Dimensions,
  KeyboardAvoidingView
} from 'react-native';
import { List, ListItem } from 'react-native-elements';
import { withTheme } from 'react-native-paper';
import { images } from '../../../assets';
import { NavigationService } from '../../navigation';
import { ScreenNames } from '../../route/ScreenNames';
import TextNormal from '../../shared/components/Text/TextNormal';
import { useStores } from '../../store/useStore';
import { containerStyle } from '../../themes/styles';
import * as Animatable from 'react-native-animatable';
import TrackPlayer from 'react-native-track-player';
import Video from 'react-native-video';
import { styles } from './style';
import { firebase } from '@react-native-firebase/messaging';
import AxiosFetcher from '../../api/AxiosFetch';
import IALocalStorage from '../../shared/utils/storage/IALocalStorage';
import Loading from '../../shared/components/Loading';
import { ToastHelper } from '../../shared/components/ToastHelper';
import Constant from '../../shared/utils/constant/Constant';
import Speaker from '../../shared/components/Speaker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HeaderFullPostDetail from '../../shared/components/Header/HeaderFullPostDetail';
import { colors } from '../../shared/utils/colors/colors';
import FastImage from 'react-native-fast-image';
import { ScreenWidth, ScreenHeight } from '../../shared/utils/dimension/Divices';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import moment from 'moment'
import { SPACINGS, FONTSIZES } from '../../themes';
import { FirebaseService } from '../../api/FirebaseService';
import { TextInput } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import icons from '../../shared/utils/icons/icons';

const PostDetailScreen = (props) => {
  const { colorsApp } = props.theme;
  const { t } = useTranslation();
  const { userStore } = useStores();
  const [isLoading, setIsLoading] = useState(false);
  const [post, setPost] = useState({});
  const [newComment, setNewComment] = useState('');
  const [userDetail, setUserDetail] = useState({});
  const [contentHeight, setContentHeight] = useState({});
  const refInput = useRef();
  const refScrollView = useRef();

  let data = props.navigation.state.params.data || {};
// console.log(JSON.stringify(data));
  useEffect(() => {
    getPostDetail();
    getProfile();
  }, []);
  const isBlog = props?.navigation?.state?.params?.isBlog; 
  const getPostDetail = async () => {
    // console.log(isBlog ? Constant.SCHEMA.BLOG: Constant.SCHEMA.SOCIAL + '/' + data?.userId + '_' + data?.timeInMillosecond);
    let user = await IALocalStorage.getDetailUserInfo();
    setIsLoading(true);
    await firebase
      .database()
      .ref(isBlog ? Constant.SCHEMA.BLOG: Constant.SCHEMA.SOCIAL)
      .child(data?.userId + '_' + data?.timeInMillosecond)
      .on('value', (snapshot) => {
        const data = snapshot.val() ? snapshot.val() : {};
        setPost(data)
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      });
  };

  const getProfile = async () => {
    let userInfo = await IALocalStorage.getDetailUserInfo();
    setIsLoading(true);
    AxiosFetcher({
      method: 'GET',
      url: 'user/' + userInfo?.id,
      hasToken: true,
    })
      .then((val) => {
        // console.log(val)
        if (val?.data !== '') {
          setIsLoading(false);
          userStore.userInfo = val;
          setUserDetail(val);
        } else {
          setIsLoading(false);
          ToastHelper.showError(t('account.getInfoErr'));
        }
      })
      .catch(() => {
        setIsLoading(false);
        ToastHelper.showError(t('account.getInfoErr'));
      });
  };

  const renderPostContent = (data) => {
    return (
      <View style={styles.postContent}>
        {post?.content ? <TextNormal
          style={styles.contentTextStyle}
          text={post?.content}
          numberOfLines={100}></TextNormal> : null}
         { post?.images && <View style={{ flexWrap: 'wrap' }}>
          {post?.images && (post?.images[0]?.includes('PNG') || post?.images[0]?.includes('HEIC') ||post?.images[0]?.includes('heic') || post?.images[0]?.includes('JPG') || post?.images[0]?.includes('JPEG') ||
            post?.images[0]?.includes('png') || post?.images[0]?.includes('jpg') || post?.images[0]?.includes('jpeg')) ?
            post.images.map((item, index) => {
              return (<FastImage
                key={index}
                source={{
                  uri: item || Constant.MOCKING_DATA.NO_IMG_PLACE_HOLDER,
                }}
                resizeMode="cover"
                style={styles.postImages}
              />)
            })
             :
            <Video paused={true} playWhenInactive={false} playInBackground={false} controls={true} source={{ uri: post?.images?.[0] }} style={{ width: ScreenWidth, height:  ScreenWidth}} />
          }
        </View>}
        {/* {rennderButton()} */}
      </View>
    );
  };

  const rennderButton = () => {
    let isLike = post?.likes && post?.likes?.indexOf(userStore?.userInfo?.id) !== -1;
    return (
      <View style={{ width: ScreenWidth }}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => {
              clickLike(isLike);
            }}
            style={{ display: 'flex', flexDirection: 'row' }}>
            <AntDesign
              name={isLike ? 'like1' : 'like2'}
              size={20}
              color={isLike ? colors.purpleMain : ''}
            />
            <TextNormal text={t('social.like')}></TextNormal>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              refInput.current.focus();
            }}
            style={{ display: 'flex', flexDirection: 'row' }}>
            <EvilIcons name="comment" size={20} />
            <TextNormal text={t('social.comment')}></TextNormal>
          </TouchableOpacity>
        </View>
        {post?.likes?.length > 0 && (
          <View style={styles.likeDetail}>
            <AntDesign name={'like1'} size={20} color={colors.purpleMain} />
            <TextNormal
              style={{ marginLeft: SPACINGS.small }}
              text={
                isLike
                  ? post?.likes.length === 1
                    ? t('social.likeOnlyYou')
                    : t('social.likePrefix') +
                    ` ${post?.likes?.length - 1} ` +
                    t('social.othersLike')
                  : post?.likes?.length > 0
                    ? `${post?.likes?.length} ` + t('social.othersLike')
                    : ''
              }></TextNormal>
          </View>
        )}
      </View>
    );
  };

  const rennderComments = () => {
    return (
      <View style={{ display: 'flex', flexDirection: 'column' }}>
        {post?.comments &&
          post?.comments?.map((comment, index) => {
            return (
              <View key={'comment' + index} style={styles.commentContainer}>
                <FastImage
                  source={{
                    uri:
                      comment.avatar ||
                      Constant.MOCKING_DATA.NO_IMG_PLACE_HOLDER,
                  }}
                  resizeMode="cover"
                  style={styles.avatarComment}
                />
                <View style={styles.commentOwner}>
                  <TextNormal
                    style={styles.commentTitle}
                    text={comment.name}
                    numberOfLines={100}
                  />
                  <TextNormal
                    style={styles.commentContentTextStyle}
                    text={comment.content}
                    numberOfLines={100}
                  />
                </View>
              </View>
            );
          })}
        <View style={styles.newCommentContainer}>
          <FastImage
            source={{
              uri:
                userDetail?.avatar ||
                Constant.MOCKING_DATA.NO_IMG_PLACE_HOLDER,
            }}
            resizeMode="cover"
            style={styles.avatarComment}
          />
          <View style={styles.newComment}>
            <TextInput
              ref={refInput}
              numberOfLines={10}
              onFocus={() => {
                refScrollView.current.scrollToEnd({ animated: true });
              }}
              style={[
                containerStyle.defaultMarginTopSmall,
                containerStyle.textDefaultNormal,
                styles.commentInput,
                {
                  height: 100,
                },
              ]}
              maxLength={1000}
              value={newComment}
              onChangeText={(text) => setNewComment(text)}
              multiline
              placeholder={t('social.commentInput.placeholder')}
            />
          </View>
          {/* <TouchableOpacity
              onPress={() => {
                postComment();
              }}>
              <FontAwesome5
                name={'paper-plane'}
                size={24}
                style={{margin: SPACINGS.small}}
                color={colors.purpleMain}
              />
              
            </TouchableOpacity> */}
          <TouchableOpacity
            style={{ marginLeft: SPACINGS.large }}
            onPress={() => {
              postComment();
            }}>
            {icons.IC_SEND_MSG}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const clickLike = () => {
    let userDetail = userStore?.userInfo;
    FirebaseService.queryAllItemBySchemaWithSpecifiedChild(isBlog ? Constant.SCHEMA.BLOG: Constant.SCHEMA.SOCIAL, '_id', data._id, false, false).then((val) => {
      // console.log(val);
      if (val && val.length > 0) {
        let currentLike = val[0].likes ? [...val[0].likes] : [];
        if (currentLike.indexOf(userDetail?.id) !== -1) {
          currentLike = currentLike.filter(item => item !== userDetail?.id);
        } else {
          currentLike.push(userDetail?.id);
        }
        const newData = { ...val[0] };
        newData.likes = currentLike;
        FirebaseService.updateItem(isBlog ? Constant.SCHEMA.BLOG: Constant.SCHEMA.SOCIAL, data?.userId + '_' + data?.timeInMillosecond, newData).then(
          val1 => {
            setPost(newData);
          }
        )
      }
    }
    )
  }

  const postComment = () => {
    setIsLoading(true);
    FirebaseService.queryAllItemBySchemaWithSpecifiedChild(
      isBlog ? Constant.SCHEMA.BLOG: Constant.SCHEMA.SOCIAL,
      '_id',
      data._id,
      false,
      false,
    ).then((val) => {
      // console.log(val);
      if (val && val.length > 0) {
        let currentComments = val[0].comments ? [...val[0].comments] : [];
        let newCommentData = {
          id: userDetail?.id,
          name: userDetail?.name,
          avatar: userDetail.avatar,
          content: newComment,
          time: new Date().getTime(),
        };
        currentComments.push(newCommentData);
        currentComments.sort((a, b) => (a.time > b.time ? 1 : b.time > a.time ? -1 : 0));


        const newData = { ...val[0] };
        newData.comments = currentComments;

        FirebaseService.updateItem(
          isBlog ? Constant.SCHEMA.BLOG: Constant.SCHEMA.SOCIAL,
          data?.userId + '_' + data?.timeInMillosecond,
          newData,
        ).then((val1) => {
          setIsLoading(false);
          setPost(newData);
          setNewComment('');
        });
      }
    });
  };
  return (
    <View style={[containerStyle.default]}>
      <StatusBar barStyle={colorsApp.statusBar} />
      <SafeAreaView>
        <HeaderFullPostDetail
          avatar={data?.avatar}
          name={data?.name}
          onDetail={() => { NavigationService.navigate(ScreenNames.Account, { data }) }}
          createdAt={data?.timeInMillosecond}
          hasButton
          rightIco={<Ionicons name="person-sharp" />}
        />
        <KeyboardAvoidingView
          behavior={"padding"}
          keyboardVerticalOffset={(Platform.OS === 'ios' ? 0 : -230)}
          style={{ display: 'flex' }}>
          {/* <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          extraHeight={100}
          contentContainerStyle={{
            flex: 1,
            width: '100%',
            height: '100%',
            backgroundColor: 'white',
          }}> */}
          <ScrollView
            contentContainerStyle={styles.content}
            ref={refScrollView}
            onContentSizeChange={(contentWidth, contentHeight) => {
              // setContentHeight(contentHeight);
            }}>
            {renderPostContent(post)}
            {rennderButton(post)}
            {rennderComments(post)}
          </ScrollView>
        </KeyboardAvoidingView>
        {/* </KeyboardAwareScrollView> */}
      </SafeAreaView>
      {isLoading && <Loading />}
    </View>
  );
};
export default withTheme(PostDetailScreen);
