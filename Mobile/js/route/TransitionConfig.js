import CardStackStyleInterpolator from "react-navigation/src/views/CardStack/CardStackStyleInterpolator";
import {Animated, Easing, Platform} from "react-native";

const {
	forHorizontal,
	forVertical,
	forFadeFromBottomAndroid,
	forFade,
} = CardStackStyleInterpolator;

// this is default iOS could get fancier as desired
// see https://github.com/react-community/react-navigation/blob/d1c434b54c73b6ed17b1642acd6646fbca92c92e/src/views/CardStack/TransitionConfigs.js
const TransitionSpec = {
	duration: 500,
	easing: Easing.bezier(0.2833, 0.99, 0.31833, 0.99),
	timing: Animated.timing,
};

const TransitionConfig = () => {
	return {
		transitionSpec: TransitionSpec,
		screenInterpolator: (sceneProps) => {
			const params = sceneProps.scene.route.params || {};
			const transition = params.transition || Platform.OS;

			return {
				horizontal: forHorizontal(sceneProps),
				vertical: forVertical(sceneProps),
				modal: forVertical(sceneProps),
				fade: forFade(sceneProps),
				ios: forHorizontal(sceneProps),
				android: forFadeFromBottomAndroid(sceneProps),
			}[transition];
		}
	};
};

export default TransitionConfig;