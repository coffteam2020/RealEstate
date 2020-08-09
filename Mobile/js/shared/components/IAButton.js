import React from "react";
import {Text, TouchableOpacity, StyleSheet, View} from "react-native";
import * as Animatable from "react-native-animatable";
import {
	fadeInAnimation,
	fadeOutAnimation,
	horSmallerAnimation,
	horBiggerAnimation
} from "../utils/animations/animations";
import {colors} from "../utils/colors/colors";
import IARefreshing from "./IARefreshing";

const REFRESHING_ICON_SIZE = 14;
const BUTTON_ANIM_DURATION_TIME = 500;
const LOADING_ANIM_DURATION_TIME = 700;

const IAButton = ({
	onPress,
	isDisable,
	style,
	containerStyle = {},
	title,
	titleStyle,
	loading,
	dotSize,
	duration,
	leftIcon,
	leftIconContainerStyle,
	rightIcon,
	rightIconContainerStyle
}) => {
	return (
		<Animatable.View
			animation={loading ? horSmallerAnimation : horBiggerAnimation}
			duration={(duration && duration) || BUTTON_ANIM_DURATION_TIME}
			style={[styles.mainContainer, StyleSheet.flatten(containerStyle)]}
		>
			<TouchableOpacity
				style={[styles.button, StyleSheet.flatten(style)]}
				disabled={(isDisable && isDisable) || false}
				onPress={onPress}
			>
				<View style={[styles.iconContainer, leftIconContainerStyle]}>{leftIcon && leftIcon}</View>
				<Text style={[styles.buttonText, StyleSheet.flatten(titleStyle)]}>
					{(title && title) || "Button"}
				</Text>
				<View style={[styles.iconContainer, rightIconContainerStyle]}>
					{rightIcon && rightIcon}
				</View>
			</TouchableOpacity>
			{loading && (
				<Animatable.View
					animation={loading ? fadeInAnimation : fadeOutAnimation}
					duration={LOADING_ANIM_DURATION_TIME}
					style={styles.indicatorWrap}
				>
					<IARefreshing
						size={(dotSize && dotSize) || REFRESHING_ICON_SIZE}
						style={{alignSelf: "center"}}
						color={colors.red}
					/>
				</Animatable.View>
			)}
		</Animatable.View>
	);
};

export default IAButton;
const styles = StyleSheet.create({
	mainContainer: {
		justifyContent: "center",
		alignSelf: "center",
		alignItems: "center",
		alignContent: "center"
	},

	children: {
		alignSelf: "center",
		fontSize: 17
	},
	buttonText: {
		margin: 12,
		fontSize: 14,
		alignSelf: "center",
		flex: 1,
		fontFamily: "Helvetica",
		color: "#FFFFFF",
		letterSpacing: 0.38,
		textAlign: "center"
	},
	button: {
		borderRadius: 50,
		alignSelf: "center",
		// elevation: 2,
		// shadowColor: "#000000",
		// shadowOpacity: 0.4,
		// shadowRadius: 2,
		// shadowOffset: {
		//   height: 1
		// },
		// width: "100%",
		height: 45,
		marginTop: 0,
		marginBottom: 0,
		flexDirection: "row",
		justifyContent: "center",
	},
	indicatorWrap: {
		alignSelf: "center",
		position: "absolute",
		height: 45,
		justifyContent: "center"
	},
	iconContainer: {
		width: 40,
		justifyContent: "center",
		alignItems: "center"
	}
});
