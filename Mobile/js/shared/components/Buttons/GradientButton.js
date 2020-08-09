/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Animated, View, TouchableOpacity, StyleSheet,} from 'react-native';
import PropTypes from 'prop-types';
import fonts from '../../utils/fonts/fonts';
import {colors} from '../../utils/colors/colors';
import {SPACINGS, FONTSIZES, SIZES} from '../../../themes';
import {ScreenWidth} from '../../utils/dimension/Divices';
import TextNormal from '../Text/TextNormal';
import * as Animatable from 'react-native-animatable';
import GradientBackground from '../GradientBackground';

const GradientButton = ({disable, style, text, textStyle, onPress, isFullBackground, hasIco, ico, fromColor, toColor}) => {
	let isFull = isFullBackground && isFullBackground;
	return (
		<TouchableOpacity
			disabled={disable}
			activeOpacity={0.9}
			style={[style,
				{opacity: disable && disable ? 0.5 : 1},
				isFull ? {backgroundColor: colors.whiteTransparent} : {}]}
			onPress={onPress}>
			<Animatable.View animation="fadeIn" duration={1000}>
				<GradientBackground fromColor={fromColor} toColor={toColor} style={[styles.default, style,
					isFull ? {backgroundColor: colors.whiteTransparent} : {},
					{opacity: disable && disable ? 0.5 : 1},]}>
					<TextNormal text={text} style={[styles.text, textStyle]} />
					{hasIco && hasIco && ico ? ico : null}
				</GradientBackground>
			</Animatable.View>
		</TouchableOpacity>
	);
};


export default GradientButton;

const styles = StyleSheet.create({
	default: {
		// padding: SPACINGS.default,
		height: SIZES.button.height,
		width: ScreenWidth - SPACINGS.xLarge * 2,
		borderRadius: SIZES.button.borderRadius/2,
		justifyContent: 'center',
		alignContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		shadowColor: colors.black,
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.25,
		shadowRadius: 0.84,
		elevation: 3,
	},
	text: {
		color: colors.whiteTransparent,
		fontSize: FONTSIZES.avg
	}
});