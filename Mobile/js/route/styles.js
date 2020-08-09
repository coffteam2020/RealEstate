import {StyleSheet} from "react-native";
import {ScreenHeight} from "../shared/utils/dimension/Divices";
import {colors} from "../shared/utils/colors/colors";
import fonts from "../shared/utils/fonts/fonts";

export const styles = StyleSheet.create({
	mainContainer: {
		backgroundColor: colors.white,
		flex: 1,
	},
	itemContentContainer: {
		marginLeft: 10,
		marginRight: 10,
		paddingEnd: 30,
		flexDirection: "column"
	},
	imgContentContainer: {
		borderRadius: 5
	},
	badge: {
		position: "absolute",
		height: 10,
		width: 10,
		backgroundColor: colors.yellow_default,
		borderRadius: 10,
		bottom: 0,
		left: 0
	},
	drawerItem: {
		fontFamily: fonts.family.nunito.bold,
		fontSize: 18,
		fontWeight: "normal",
		fontStyle: "normal",
		letterSpacing: 0,
		color: "#ffffff",
		textAlign: "center"
	},
	imgBackground: {
		width: "100%",
		marginTop: 10,
		height: ScreenHeight,
		justifyContent: "center",
		alignContent: "center",
		alignItems: "center",
		alignSelf: "center"
	},
	imgBackgroundContent: {
		marginBottom: 100
	},
	drawer: {
		marginLeft: 10,
		marginTop: 15,
	}
});

export default styles;
