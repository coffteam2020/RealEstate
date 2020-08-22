import { StyleSheet } from "react-native";
import { colors } from "../../shared/utils/colors/colors";
import { ScreenHeight, ScreenWidth } from "../../shared/utils/dimension/Divices";
import { SPACINGS } from "../../themes";


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
		height: ScreenHeight
	},
	img: {
		marginLeft: SPACINGS.avg, 
		width: ScreenWidth / 3, 
		height: ScreenWidth / 3
	}
});

export default {
	styles
};
