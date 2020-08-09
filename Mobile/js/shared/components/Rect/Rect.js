/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Animated, Text, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import fonts from '../../utils/fonts/fonts';
import { colors } from '../../utils/colors/colors';
import { SPACINGS, FONTSIZES, SIZES, RADIUS } from '../../../themes';
import { containerStyle } from '../../../themes/styles';
import TextNormal from '../Text/TextNormal';

const Rect = ({ props, style, text, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.default, containerStyle.shadowYellow,
        { backgroundColor: colors.blue_dodger },
        { borderColor: props.theme.colorsApp.borderView },
            style]}>
            <TextNormal props={props} text={text} />
        </TouchableOpacity>
    );
};


export default Rect;

const styles = StyleSheet.create({
    default: {
        height: SIZES.health.height,
        borderWidth: 0.2,
        marginEnd: SPACINGS.small,
        marginBottom: SPACINGS.small,
        paddingLeft: SPACINGS.default,
        paddingRight: SPACINGS.default,
        borderRadius: RADIUS.health,
        justifyContent: "center",
        alignItems: "center"
    }
})