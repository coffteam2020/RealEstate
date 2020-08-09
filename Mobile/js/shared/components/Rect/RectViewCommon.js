/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Animated, View, TouchableOpacity, StyleSheet, } from 'react-native';
import PropTypes from 'prop-types';
import fonts from '../../utils/fonts/fonts';
import { colors } from '../../utils/colors/colors';
import { SPACINGS, FONTSIZES, SIZES } from '../../../themes';
import { ScreenWidth, ScreenHeight } from '../../utils/dimension/Divices';
import TextNormal from '../Text/TextNormal';
import * as Animatable from "react-native-animatable";
import { containerStyle } from '../../../themes/styles';

const RectViewCommon = ({ props, style, children }) => {
    return (
        <Animatable.View animation="fadeIn" style={[styles.default, containerStyle.shadow,
        { backgroundColor: props.theme.colorsApp.backgroundInput }, style]}>
            {children}
        </Animatable.View>
    );
};


export default RectViewCommon;

const styles = StyleSheet.create({
    default: {
        padding: SPACINGS.xxLarge,
        width: ScreenWidth,
        height: ScreenHeight / 3
    },
    text: {
        fontSize: FONTSIZES.default,
        textAlign: "center",
        fontFamily: fonts.family.nunito.medium,
        marginTop: SPACINGS.default
    }
})