import {StyleSheet} from 'react-native';
import {colors} from '../../shared/utils/colors/colors';
import {ScreenHeight, ScreenWidth} from '../../shared/utils/dimension/Divices';
import {SPACINGS, RADIUS, FONTSIZES} from '../../themes';
import fonts from '../../shared/utils/fonts/fonts';

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  content: {
    paddingBottom: 80,
  },
  avatar: {
    width: ScreenWidth * 0.1,
    height: ScreenWidth * 0.1,
    borderRadius: ScreenWidth * 0.6,
    marginRight: SPACINGS.avg,
  },
  postInput: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomColor: colors.gray,
    borderBottomWidth: 1,
    width: ScreenWidth,
    paddingLeft: SPACINGS.avg,
    paddingBottom: SPACINGS.avg,
  },
  itemContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  itemHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: SPACINGS.small,
  },
  postContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    flexWrap: 'nowrap',
    marginBottom: SPACINGS.small,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: colors.gray,
    paddingTop: SPACINGS.small,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
    paddingBottom: SPACINGS.small,
  },
  likeDetail: {
    justifyContent: 'flex-start',
    display: 'flex',
    flexDirection: 'row',
    paddingTop: SPACINGS.small,
    paddingBottom: SPACINGS.small,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
    marginLeft: SPACINGS.avg,
  },
  commentContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'flex-start',
    width: ScreenWidth * 0.9,
    marginTop: SPACINGS.small,
    alignSelf: 'center',
  },
  avatarComment: {
    width: ScreenWidth * 0.1,
    height: ScreenWidth * 0.1,
    borderRadius: ScreenWidth * 0.6,
    marginRight: SPACINGS.avg,
    alignSelf: 'flex-start',
  },
  commentOwner: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    backgroundColor: colors.gray_bg,
    borderRadius: 20,
    padding: 10,
    flex: 1,
  },
  commentTitle: {
    fontFamily: fonts.family.nunito.bold,
    fontSize: FONTSIZES.avg,
    marginHorizontal: SPACINGS.avg,
  },
  commentContentTextStyle: {
    marginHorizontal: SPACINGS.avg,
  },
  contentTextStyle: {
    marginHorizontal: SPACINGS.avg,
    paddingBottom: 50,
    paddingTop: 20,
  },
  postImages: {
    width: ScreenWidth,
    height: ScreenWidth,
  },
  newCommentContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    alignContent: 'flex-start',
    width: ScreenWidth * 0.9,
    marginTop: SPACINGS.small,
    marginBottom: SPACINGS.xxxLarge,
  },
  newComment: {
    backgroundColor: colors.gray_bg,
    borderRadius: 20,
    padding: 10,
    flex: 1,
    marginBottom: SPACINGS.avg
  },
  commentInput: {
    padding: SPACINGS.avg,
  },
});

export default {
  styles,
};
