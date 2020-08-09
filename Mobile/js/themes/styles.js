import {StyleSheet, Platform} from 'react-native';
import {colors} from '../shared/utils/colors/colors';
import {SPACINGS, SIZES, FONTSIZES, RADIUS} from '.';
import {ScreenWidth, ScreenHeight} from '../shared/utils/dimension/Divices';
import {color} from 'react-native-reanimated';
import fonts from '../shared/utils/fonts/fonts';

export const containerStyle = StyleSheet.create({
	default: {
    flex: 1,
	},
	defaultFull: {
		width: ScreenWidth,
		height: ScreenHeight,
	},
	defaultWithMargin: {
		flex: 1,
		padding: SPACINGS.xLarge,
	},
	defaultMarginTop: {
		marginTop: SPACINGS.large,
	},
	defaultMarginTopSmall: {
		marginTop: SPACINGS.sSmall,
	},
	smallMarginTop: {
		marginTop: SPACINGS.sSmall,
	},
	ssmallMarginTop: {
		marginTop: SPACINGS.sSmall + 2,
	},
	defaultPadding: {
		padding: SPACINGS.xLarge,
	},
	smallPadding: {
		padding: SPACINGS.small,
	},
	defaultPaddingSmall: {
		padding: SPACINGS.small,
		paddingBottom: 0,
	},
	defaultPaddingTop: {
		paddingTop: SPACINGS.large,
	},
	defaultMarginBottom: {
		marginBottom: SPACINGS.large,
	},
	defaultPaddingTextEnd: {
		padding: 10,
		paddingEnd: SPACINGS.large,
		paddingTop: 0,
	},
	center: {
		justifyContent: 'center',
		alignContent: 'center',
		alignItems: 'center',
		flex: 1,
	},
	defaultBackground: {
		backgroundColor: '#665AAA',
	},
	defaultBackgroundSecond: {
		backgroundColor: '#FFF1E8',
	},
	paddingDefault: {
		padding: SPACINGS.large,
	},
	paddingSmall: {
		padding: SPACINGS.small,
	},
	paddingAvg: {
		padding: SPACINGS.default,
	},
	paddingSSmall: {
		padding: SPACINGS.sSmall,
	},
	paddingZero: {
		padding: 0,
	},
	centerNotFlex: {
		justifyContent: 'center',
		alignContent: 'center',
		alignItems: 'center',
		alignSelf: 'center',
	},
	centerNotFlexWithoutSelf: {
		justifyContent: 'center',
		alignContent: 'center',
	},
	centerFlexEnd: {
		justifyContent: 'flex-end',
		alignContent: 'flex-end',
		alignItems: 'center',
	},
	centerFlexBegin: {
		justifyContent: 'flex-start',
		alignContent: 'flex-start',
		alignItems: 'center',
	},
	horContainer: {
		flexDirection: 'row',
		alignContent: 'center',
		alignItems: 'center',
		justifyContent: 'space-around',
	},
	horContainerWithOutCenter: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: SPACINGS.default,
	},
	horContainerWithCenter: {
		flexDirection: 'row',
		alignItems: 'center',
		alignContent: 'center',
		justifyContent: 'space-between',
	},
	horContainerWithCenterDefault: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	horContainerNearly: {
		flexDirection: 'row',
		alignContent: 'center',
		justifyContent: 'center',
	},
	horContainerNearlyDefault: {
		flexDirection: 'row',
	},
	horContainerNearlyDefaultCenter: {
		flexDirection: 'row',
		justifyContent: 'center',
	},
	defaultTextInput: {
		marginBottom: SPACINGS.xxLarge,
	},
	defaultTextMargin: {
		marginBottom: SPACINGS.avg,
	},
	defaultTextMarginLeft: {
		marginLeft: SPACINGS.avg,
	},
	smallTextMarginLeft: {
		marginLeft: SPACINGS.sSmall,
	},
	defaultTextMarginEnd: {
		marginRight: SPACINGS.avg,
	},
	largeTextMarginEnd: {
		marginRight: SPACINGS.xxLarge,
	},
	largeTextMarginStart: {
		marginLeft: SPACINGS.xLarge,
	},
	largeTextMargin: {
		marginBottom: SPACINGS.small,
	},
	textInputHeader: {
		width: ScreenWidth * 0.9,
		borderRadius: RADIUS.backIco,
	},
	textInputHeaderDefault: {
		width: ScreenWidth * 0.7,
		borderRadius: RADIUS.backIco,
	},
	textInputHeaderCenter: {
		width: ScreenWidth * 0.6,
		borderRadius: RADIUS.backIco,
	},
	textLink: {
		color: colors.blue_dodger,
	},
	textWhite: {
		color: colors.whiteTransparent,
	},
	progress: {
		width: ScreenWidth / 4,
		height: ScreenWidth / 4,
	},
	shadow:
    Platform.OS === 'ios'
    	? {
    		shadowColor: colors.black_lessy,
    		shadowOffset: {
    			width: 0,
    			height: 2,
    		},
    		shadowOpacity: 0.25,
    		shadowRadius: 5.84,
    	}
    	: {elevation: 5},
	shadowYellow:
    Platform.OS === 'ios'
    	? {
    		shadowColor: colors.yellow_default,
    		shadowOffset: {
    			width: 0,
    			height: 4,
    		},
    		shadowOpacity: 0.45,
    		shadowRadius: 0.84,
    	}
    	: {
    		elevation: 2,
    	},
	shadowWhite:
    Platform.OS === 'ios'
    	? {
    		shadowColor: colors.white,
    		shadowOffset: {
    			width: 0,
    			height: 4,
    		},
    		shadowOpacity: 0.45,
    		shadowRadius: 0.84,
    	}
    	: {
    		elevation: 2,
    	},
	avatarDefault: {
		width: 120,
		height: 120,
		borderColor: 'white',
		borderWidth: 4
	},
	imgDefaultScreenshot: {
		width: 120,
		height: 150,
		borderRadius: 12,
		marginEnd: 10,
		alignSelf: 'center',
		alignItems: 'center',
		justifyContent: 'center',
	},
	medicalImg: {
		width: 76,
		height: 76,
		borderRadius: 38,
		marginEnd: 10,
		alignSelf: 'center',
		alignItems: 'center',
		justifyContent: 'center',
	},
	avatarRectRounded: {
		borderRadius: 30,
		width: ScreenWidth * 0.4,
		height: ScreenWidth * 0.4,
	},
	avatarRectRoundedPlaceHolder: {
		borderRadius: 10,
		width: ScreenWidth * 0.11,
		height: ScreenWidth * 0.11,
	},
	avatarRectRoundedDefault: {
		borderRadius: 18,
		width: ScreenWidth * 0.21,
		height: ScreenWidth * 0.21,
	},
	avatarRectRoundedStoreDefault: {
		width: ScreenWidth * 0.12,
		height: ScreenWidth * 0.12,
		justifyContent: 'center'
	},
	avatarRectRoundedCenter: {
		borderRadius: 18,
		width: ScreenWidth * 0.35,
		height: ScreenWidth * 0.35,
	},
	line: {
		height: 1,
		marginTop: SPACINGS.default,
		marginBottom: SPACINGS.default,
		backgroundColor: colors.black_five,
	},
	iconStyle: {
		width: SIZES.back.width,
		height: SIZES.back.width,
		justifyContent: 'center',
		alignContent: 'center',
		alignItems: 'center',
		alignSelf: 'center',
	},
	textHeader: {
		fontSize: FONTSIZES.large,
		fontFamily: fonts.family.nunito.bold,
	},
	textHeaderWithMargin: {
		fontSize: FONTSIZES.xxLarge,
		fontFamily: fonts.family.nunito.extraBold,
	},
	textHeaderSmall: {
		fontSize: FONTSIZES.xAvg,
		fontFamily: fonts.family.nunito.bold,
	},
	textHeaderSmallCenter: {
		fontSize: FONTSIZES.xAvg,
		fontFamily: fonts.family.nunito.bold,
		textAlign: 'center',
	},
	textDefault: {
		fontSize: FONTSIZES.avg,
		fontFamily: fonts.family.nunito.bold,
	},
	textDefaultNormal: {
		fontSize: FONTSIZES.default,
		fontFamily: fonts.family.nunito.regular,
	},
	textDefaultContent: {
		fontSize: FONTSIZES.small,
		fontFamily: fonts.family.nunito.regular,
	},
	textNormal: {
		fontSize: FONTSIZES.default,
		fontFamily: fonts.family.nunito.regular,
	},
	textNormalBlack: {
		fontSize: FONTSIZES.default,
		fontFamily: fonts.family.nunito.black,
		color: colors.black,
	},
	textNormalBlackLarge: {
		fontSize: FONTSIZES.avg,
		fontFamily: fonts.family.nunito.regular,
		color: colors.black,
	},
	textNormalBold: {
		fontSize: FONTSIZES.default,
		fontFamily: fonts.family.nunito.bold,
	},
	textContent: {
		fontSize: FONTSIZES.default,
		fontFamily: fonts.family.nunito.light,
		color: colors.whiteLess,
	},
	textContentSmall: {
		fontSize: FONTSIZES.small,
		fontFamily: fonts.family.nunito.regular,
		color: colors.whiteLess,
	},
	textCenter: {
		alignSelf: 'center',
		textAlign: 'center',
	},
	tabbarViewIco: {
		height: 38,
		width: 38,
		borderRadius: 12,
		alignItems: 'center',
		justifyContent: 'center',
	},
	activeTabbar: {},
	activeTabbarLight: {
		backgroundColor: '#dadada',
	},
	inActiveTabbar: {
		borderColor: '#29292a',
		borderWidth: 0,
		backgroundColor: '#fff',
	},
	buttonHalf: {
		width: ScreenWidth / 2,
	},
	buttonThird: {
		width: ScreenWidth / 3,
	},
	buttonFlexEnd: {
		alignSelf: 'flex-end',
	},
	buttonCenter: {
		alignSelf: 'center',
	},
	textStroke: {
		textDecorationLine: 'line-through',
		textDecorationStyle: 'solid',
		textDecorationColor: '#000',
	},
	bottomSheetDefault: {
		borderTopEndRadius: 18,
		borderTopLeftRadius: 18,
		padding: SPACINGS.xLarge,
	},
	drag: {
		width: ScreenWidth / 4,
		height: 5,
		backgroundColor: '#C4C4C4',
		borderRadius: 3,
		justifyContent: 'center',
		alignSelf: 'center',
	},
	closeSmall: {
		position: 'absolute',
		top: SPACINGS.small,
		right: SPACINGS.default,
		backgroundColor: colors.white,
		width: 25,
		height: 25,
		borderRadius: 12.5,
	},
	attachment: {
		height: ScreenWidth / 2,
		width: ScreenWidth / 2 - SPACINGS.xxLarge * 2,
	},
	dot: {
		position: 'absolute',
		top: SPACINGS.sSmall,
		right: SPACINGS.xxLarge,
		borderRadius: 12,
		width: 24,
		height: 24,
		backgroundColor: 'rgba(0,0,0,0.3)',
	},
	warningText: {
		fontFamily: fonts.family.nunito.semiBold,
		fontSize: FONTSIZES.default,
		color: colors.red_cinnabar,
	},
	doctorAvt: {
		width: 64,
		height: 64,
	},
	careTeam: {
		width: 64,
		height: 20,
	},
	careTeamFull: {
		width: 88,
		height: 20,
	},
	doctorAvtProfile: {
		width: 88,
		height: 88,
		borderRadius: 22,
	},
	blackStyleIcon: {
		backgroundColor: 'rgba(0,0,0,0.2)',
	},
	actionDoctor: {
		width: ScreenWidth / 3 - SPACINGS.xxLarge,
		height: ScreenHeight / 13,
		borderRadius: 8,
		padding: SPACINGS.default,
	},
	tab: {
		height: 50,
	},
	mapDetail: {
		height: ScreenWidth / 2,
		width: ScreenWidth - SPACINGS.xLarge * 2,
		borderRadius: SIZES.rectViewRounded.borderRadius,
	},
	dragIconColor: {
		color: '#C4C4C4',
	},
});
