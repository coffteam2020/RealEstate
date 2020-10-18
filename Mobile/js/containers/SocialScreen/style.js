import {StyleSheet} from 'react-native';
import {colors} from '../../shared/utils/colors/colors';
import {ScreenHeight, ScreenWidth} from '../../shared/utils/dimension/Divices';
import {SPACINGS, FONTSIZES} from '../../themes';
import fonts from '../../shared/utils/fonts/fonts'

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  content: {
	alignItems: 'center',
	paddingBottom: 50,
  },
  avatar: {
    width: ScreenWidth * 0.1,
    height: ScreenWidth * 0.1,
	borderRadius: ScreenWidth * 0.6,
	marginRight: SPACINGS.avg
  },
  postInput: {
	display: "flex",
	flexDirection: "row",
	alignItems: "center",
	justifyContent: "flex-start",
	borderBottomColor: colors.gray,
	borderBottomWidth: 1,
	width: ScreenWidth,
	paddingLeft: SPACINGS.avg,
	paddingBottom: SPACINGS.avg
  },
  postContainer:{
	display: "flex",
	flexDirection: "column"
  },
  postHeader:{
	display: "flex",
	flexDirection: "row",
	alignItems: "center",
	justifyContent: "flex-start",
	marginBottom: SPACINGS.small,
	marginLeft: SPACINGS.avg
  },
  postOwner:{
	fontSize: FONTSIZES.avg,
	fontFamily: fonts.family.nunito.bold
  },
  postTime:{
	fontSize: FONTSIZES.xSmall,
  },
  postContent:{
	display: "flex",
	flexDirection: "column",
	alignItems: "flex-start",
	flexWrap: "nowrap",
	justifyContent: "space-evenly",
  },
  contentTextStyle:{
	marginHorizontal: SPACINGS.avg,
  },
  postImages:{
	width: ScreenWidth,
    height: ScreenWidth,
	// margin: SPACINGS.small
  },
  postFooter:{
	display: "flex",
	flexDirection: "column",
	justifyContent: "space-around"
  },
  noDataMessage:{
	  textAlign: "center"
  }
});

export default {
  styles,
};
