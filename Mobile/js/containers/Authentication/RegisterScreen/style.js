import { StyleSheet } from "react-native";
import { colors } from "../../../shared/utils/colors/colors";
import { ScreenHeight, ScreenWidth } from "../../../shared/utils/dimension/Divices";
import { SPACINGS, FONTSIZES, RADIUS } from "../../../themes";
import fonts from "../../../shared/utils/fonts/fonts";


export const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	content: {
		justifyContent: 'center',
		alignItems: 'center',
		width: ScreenWidth,
		height: ScreenHeight / 5,
	},
	fieldContainer: {
		alignItems: 'center',
		width: ScreenWidth,
		height: ScreenHeight / 2 - SPACINGS.xxLarge,
		backgroundColor: colors.whiteBackground,
		borderTopRightRadius: 50,
		borderTopLeftRadius: 50,
		paddingTop: SPACINGS.xxxLarge
	},
	img: {
		marginLeft: SPACINGS.avg,
		width: ScreenWidth / 3,
		height: ScreenWidth / 3
	},
	fieldItem: {
		marginBottom: SPACINGS.xxxLarge,
	},
	signUp: {
		alignItems: "center",
		justifyContent: "center",
		alignContent: "center"
	},
	signUpTitle: {
		color: colors.blue_dodger,
		fontFamily: fonts.family.nunito.regular,
		fontSize: FONTSIZES.default,
		marginTop: SPACINGS.avg,
	},
	signUpTitleDefault: {
		marginTop: SPACINGS.avg,
	},
	signUpMotto: {
		fontFamily: fonts.family.nunito.semiBold,
		fontSize: FONTSIZES.default,
		marginTop: SPACINGS.avg,
	},
	footerContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		width: ScreenWidth,
		height: ScreenHeight / 3 ,
		backgroundColor: colors.whiteBackground
	},
	socialContainer: {
		margin: SPACINGS.default,
		width: ScreenWidth - SPACINGS.xLarge * 2,
	},
	fieldItemTop: {
		// marginTop: SPACINGS.xLarge,
	},
	container: {
		marginTop: SPACINGS.xxLarge
	},
	motto: {
		marginBottom: SPACINGS.xxxLarge,
		fontFamily: fonts.family.nunito.bold,
		textAlign: 'center',
		width: '90%',
		fontSize: FONTSIZES.large,
		color: colors.whiteBackground
	},
	mottoEmail: {
		marginBottom: SPACINGS.xxxLarge,
		fontSize: FONTSIZES.default,
		fontFamily: fonts.family.nunito.regular
	},
	sigInMotto: {
		color: colors.purpleMain,
		fontFamily: fonts.family.nunito.bold,
	},

	button: {
		marginTop: SPACINGS.large,
		borderRadius: RADIUS.input
	},
	modalContent: {
		backgroundColor: 'white',
		padding: 22,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 4,
		borderColor: 'rgba(0, 0, 0, 0.1)',
	},
	fieldPassword: {
		borderRadius: RADIUS.input ,
		paddingLeft: SPACINGS.xLarge
	},
	fieldEmailPhone: {
		borderRadius: RADIUS.input,
		paddingLeft: SPACINGS.xLarge
	}
});

export default {
	styles
};
