/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Animated, Text, TouchableOpacity, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import fonts from '../../utils/fonts/fonts';
import {colors} from '../../utils/colors/colors';
import * as Animatable from 'react-native-animatable';
import {SPACINGS, FONTSIZES} from '../../../themes';

const TextNormal = ({props, style, numberOfLines, text, clickable, onPress}) => {
	return (
		<TouchableOpacity disabled={!clickable} onPress={onPress}>
			<Animatable.Text
				animation="fadeIn"
				numberOfLines={numberOfLines || 1}
				style={[styles.default, props ? {color: props.theme.colorsApp.textColor} : {}, style]}>
				{text}
			</Animatable.Text>
		</TouchableOpacity>
	);
};


export default TextNormal;

const styles = StyleSheet.create({
	default: {
		fontFamily: fonts.family.nunito.regular,
        fontSize: FONTSIZES.default,
	}
});