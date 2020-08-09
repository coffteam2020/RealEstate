/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {Animated, View, TouchableOpacity, StyleSheet, TextInput} from 'react-native';
import PropTypes from 'prop-types';
import fonts from '../../utils/fonts/fonts';
import {colors} from '../../utils/colors/colors';
import {SPACINGS, FONTSIZES, SIZES, RADIUS} from '../../../themes';
import TextNormal from '../Text/TextNormal';
import * as Animatable from 'react-native-animatable';

const TextInputFlat = ({disabled = false, value, returnKeyType, props, multiline, placeholder, hideText, onBlur, style, textInputStyle, onChangeText, text, hasRightIco, ico, secureText, icoDisabled, onPressIco, keyboardType}) => {
	const [focusing, setIsFocus] = useState(false);
	const {colorsApp} = props?.theme;
	if (value) {
		return (
			<Animatable.View animation="flipInX" style={[styles.container, style]}>
				{hideText && hideText ? null : <TextNormal props={props} text={text} />}
				<View style={styles.containerInput}>
					<TextInput
						editable={!disabled}
						placeholder={placeholder || ''}
						placeholderTextColor={colorsApp.textColor || colors.white}
						style={[styles.default, {
							opacity: disabled && disabled ? 0.7 : 1,
							backgroundColor: colorsApp.backgroundInput || colors.blackInput,
							color: colorsApp.textColor || colors.black,
							borderColor: focusing ? colorsApp.main : colorsApp.borderColor,
							paddingEnd: SPACINGS.xxxLarge,
							paddingTop: SPACINGS.sSmall,
						}, textInputStyle]}
						returnKeyType={returnKeyType || 'done'}
						value={value}
						numberOfLines={multiline && multiline ? 100 : 1}
						multiline={multiline && multiline || false}
						selectionColor={colorsApp.textColor}
						onFocus={() => { setIsFocus(true); }}
						onSubmitEditing={onBlur ? onBlur : () => { }}
						onKeyPress={onBlur ? onBlur : () => { }}
						keyboardType={keyboardType && keyboardType || 'default'}
						onChangeText={onChangeText}
						secureTextEntry={secureText}
						onBlur={() => { setIsFocus(false); }}
					/>
					{hasRightIco && hasRightIco ?
						<TouchableOpacity onPress={onPressIco} disabled={icoDisabled && icoDisabled} style={styles.rightIcon}>
							<Animatable.View animation="fadeIn">
								{ico}
							</Animatable.View>
						</TouchableOpacity> : null}
				</View>
			</Animatable.View>
		);
	} else {
		return (
			<Animatable.View animation="flipInX" style={[styles.container, style]}>
				{hideText && hideText ? null : <TextNormal props={props} text={text} />}
				<View style={styles.containerInput}>
					<TextInput
						placeholder={placeholder || ''}
						placeholderTextColor={colorsApp.white || colors.white}
						style={[styles.default, {
							backgroundColor: colorsApp.backgroundInput || colors.blackInput,
							color: colorsApp.textColor || colors.black,
							borderColor: focusing ? colorsApp.main : colorsApp.borderColor,
							paddingEnd: SPACINGS.xxxLarge,
							paddingTop: SPACINGS.sSmall,
						}, textInputStyle]}
						returnKeyType={returnKeyType || 'done'}
						selectionColor={colorsApp.textColor}
						onFocus={() => { setIsFocus(true); }}
						numberOfLines={multiline && multiline ? 100 : 1}
						multiline={multiline && multiline || false}
						onSubmitEditing={onBlur ? onBlur : () => { }}
						onKeyPress={onBlur ? onBlur : () => { }}
						keyboardType={keyboardType && keyboardType || 'default'}
						onChangeText={onChangeText}
						secureTextEntry={secureText}
						onBlur={() => { setIsFocus(false); }}
					/>
					{hasRightIco && hasRightIco ?
						<TouchableOpacity onPress={onPressIco} disabled={icoDisabled && icoDisabled} style={styles.rightIcon}>
							<Animatable.View animation="fadeIn">
								{ico}
							</Animatable.View>
						</TouchableOpacity> : null}
				</View>
			</Animatable.View>
		);
	}
};


export default TextInputFlat;

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
		top: SIZES.textInput.height / 2 - 12,
	},
	default: {
		width: SIZES.textInput.width,
		height: SIZES.textInput.height,
		backgroundColor: colors.backgroundInput || colors.blackInput,
		color: colors.textColor || colors.black,
		borderRadius: RADIUS.default,
		fontSize: FONTSIZES.avg,
		letterSpacing: 0.5,
		borderWidth: 0.2,
		marginTop: SPACINGS.sSmall,
		fontFamily: fonts.family.nunito.regular,
		paddingLeft: SPACINGS.small
	}
});