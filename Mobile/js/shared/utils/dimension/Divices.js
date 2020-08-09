/** @format */

import {Dimensions, Platform} from "react-native";

const {width, height} = Dimensions.get("window");

const isIphoneX =
  Platform.OS === "ios" && !Platform.isPad && !Platform.isTVOS && (height >= 812 || width >= 812);

export const ScreenHeight = height;
export const ScreenWidth = width;
export const Ratio = width/height;
export const safeTopHeight = Platform.select({
	android: 0,
	ios: isIphoneX ? 30 : 20
});

export const safeBottomHeight = Platform.select({
	android: 0,
	ios: isIphoneX ? 25 : 0
});

export default {
	isIphoneX,
	ToolbarHeight: isIphoneX ? 35 : 0,
	ScreenHeight,
	ScreenWidth,
	safeTopHeight,
	safeBottomHeight
};
