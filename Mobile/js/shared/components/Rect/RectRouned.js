/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Animated, Text, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import fonts from '../../utils/fonts/fonts';
import { colors } from '../../utils/colors/colors';
import { SPACINGS, FONTSIZES, SIZES, RADIUS } from '../../../themes';
import { containerStyle } from '../../../themes/styles';

const RectRounded = ({ props, isSelected, style, ico, icoSelected, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.default, containerStyle.shadowYellow,
        isSelected && isSelected ? { backgroundColor: colors.blue_dodger } : {},
        { borderColor: props.theme.colorsApp.borderView },
            style]}>
            {isSelected ? icoSelected : ico}
        </TouchableOpacity>
    );
};


export default RectRounded;

const styles = StyleSheet.create({
    default: {
        height: SIZES.gender.height,
        width: SIZES.gender.width,
        borderWidth: 0.2,
        borderRadius: RADIUS.gender,
        justifyContent: "center",
        alignItems: "center"
    }
})