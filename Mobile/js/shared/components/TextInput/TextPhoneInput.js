/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {Animated, View, TouchableOpacity, StyleSheet, TextInput} from 'react-native';
import PropTypes from 'prop-types';
import fonts from '../../utils/fonts/fonts';
import {colors} from '../../utils/colors/colors';
import {SPACINGS, FONTSIZES, SIZES, RADIUS} from '../../../themes';
import TextNormal from '../Text/TextNormal';
import * as Animatable from 'react-native-animatable';
import PhoneInput from './PhoneInput';

const TextPhoneInput = ({props, style, onChangeText, text, backgroundColor, borderColor, cancelText, confirmText}) => {
	const [focusing, setIsFocus] = useState(false);
	const {colorsApp} = props.theme;
	return (
		<Animatable.View animation="flipInX" style={[styles.container, style]}>
			<TextNormal props={props} text={text} />
			<View style={styles.containerInput}>
				<PhoneInput cancelText={cancelText} confirmText={confirmText} autoFormat backgroundColor={backgroundColor} borderColor={borderColor} onChangeText={onChangeText} allowZeroAfterCountryCode={false}/>
			</View>
		</Animatable.View>
	);
};


export default TextPhoneInput;

const styles = StyleSheet.create({
	container: {
		marginBottom: SPACINGS.avg
	},
	containerInput: {
		width: SIZES.textInput.width,
		height: SIZES.textInput.height,
	},
	rightIcon: {
		position: 'absolute',
		right: SPACINGS.large,
		top: SIZES.textInput.height / 2 - 5,
	},
	default: {
		width: SIZES.textInput.width,
		height: SIZES.textInput.height,
		backgroundColor: colors.backgroundInput || colors.blackInput,
		color: colors.textColor || colors.black,
		borderRadius: RADIUS.default,
		marginTop: SPACINGS.small,
		fontSize: FONTSIZES.avg,
		letterSpacing: 0.5,
		borderWidth: 0.5,
		fontFamily: fonts.family.nunito.semiBold,
		paddingLeft: SPACINGS.large
	}
});