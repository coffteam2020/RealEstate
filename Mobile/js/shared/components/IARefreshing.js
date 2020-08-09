import React from "react";
import {View, StyleSheet} from "react-native";
import {DotIndicator} from "react-native-indicators";
import {colors} from "../utils/colors/colors";

const IARefreshing = ({color, size, style}) => {
	return (
		<View style={[styles.mainContainer, style]}>
			<DotIndicator
				color={(color && color) || colors.yellow}
				count={5}
				size={(size && size) || 13}
			/>
		</View>
	);
};
export default IARefreshing;
const styles = StyleSheet.create({
	mainContainer: {
		height: 30,
		alignSelf: "center",
		marginBottom: 10
	}
});
