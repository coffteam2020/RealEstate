import React, {Component} from 'react';
import {Colors, DarkTheme, DefaultTheme} from 'react-native-paper';
import {colors} from '../shared/utils/colors/colors';
import {ScreenWidth} from '../shared/utils/dimension/Divices';

export const CustomLightTheme = {
	...DefaultTheme,
	colorsApp: {
		...DefaultTheme.colors,
		subtitle: Colors.grey600,
		main: colors.logo,
		statusBar: 'dark-content',
		textColor: colors.black,
		background: colors.whiteBackground,
		white: colors.white,
		borderColor: colors.white,
		borderView: colors.black_twenty,
		backgroundBackBtn: colors.whiteTransparent,
		iconColor: colors.black,
		backgroundHome: colors.whiteBackground,
		backgroundInput: colors.whiteTransparent,
		backgroundRect: colors.whiteTransparent,
	},
};

export const CustomDarkTheme = {
	// ...DarkTheme,
	// colorsApp: {
	// 	...DarkTheme.colors,
	// 	main: colors.logo,
	// 	background: colors.blackBackground,
	// 	textColor: colors.white,
	// 	backgroundHome: colors.blackBackground,
	// 	statusBar: 'light-content',
	// 	subtitle: Colors.grey50,
	// 	backgroundRect: colors.black_rect,
	// 	borderColor: colors.borderWhiteLess,
	// 	iconColor: colors.white,
	// 	borderView: colors.white,
	// 	backgroundBackBtn: colors.blackBackground,
	// 	white: colors.white,
	// 	backgroundInput: colors.blackInput,
	// },
	...DefaultTheme,
	colorsApp: {
		...DefaultTheme.colors,
		subtitle: Colors.grey600,
		main: colors.logo,
		statusBar: 'dark-content',
		textColor: colors.black,
		background: colors.whiteBackground,
		white: colors.white,
		borderColor: colors.white,
		borderView: colors.black_twenty,
		backgroundBackBtn: colors.whiteTransparent,
		iconColor: colors.black,
		backgroundHome: colors.whiteBackground,
		backgroundInput: colors.whiteTransparent,
		backgroundRect: colors.whiteTransparent,
	},
};

export const SPACINGS = {
	default: 12,
	small: 8,
	sSmall: 3,
	zero: 0,
	avg: 10,
	large: 16,
	xLarge: 20,
	xxLarge: 24,
	xxxLarge: 30,
	superLarge: 50,
};

export const SIZES = {
	dots: {
		width: 10,
		height: 10,
		heightNormal: 10,
		widthNormal: 20,
	},
	button: {
		borderRadius: 18,
		height: 50,
	},
	categoryButton: {
		borderRadius: 18,
		height: ScreenWidth / 2 - SPACINGS.large * 2,
		width: ScreenWidth / 2 - SPACINGS.large * 2,
	},
	rectViewRounded: {
		borderRadius: 18,
		height: ScreenWidth - SPACINGS.xLarge * 2,
		width: ScreenWidth - SPACINGS.xLarge * 2,
	},
	progress: {
		width: 13,
	},
	avatar: {
		height: 100,
		width: 100,
	},
	medicalAction: {
		size: 20,
	},
	notification: {
		height: 60,
	},
	gender: {
		height: 80,
		width: 80,
	},
	health: {
		height: 45,
	},
	task: {
		height: 90,
	},
	back: {
		height: 50,
		width: 50,
		size: 25,
	},
	ico: {
		size: 25,
	},
	textInput: {
		height: 48,
		width: ScreenWidth - SPACINGS.xLarge * 2,
	},
	resultSearch: {
		height: 68,
	},
	checkbox: {
		height: 25,
		width: 25,
	},
};

export const FONTSIZES = {
	default: 15,
	small: 13,
	xAvg: 20,
	large: 24,
	avg: 17,
	xLarge: 28,
	xxLarge: 35,
  xxxLarge: 40,
  xSmall: 14,
};

export const RADIUS = {
	default: 8,
	gender: 20,
	backIco: 12,
	health: 8,
};
