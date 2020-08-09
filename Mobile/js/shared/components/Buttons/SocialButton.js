/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Animated, View, TouchableOpacity, StyleSheet, } from 'react-native';
import PropTypes from 'prop-types';
import fonts from '../../utils/fonts/fonts';
import { colors } from '../../utils/colors/colors';
import { SPACINGS, FONTSIZES, SIZES } from '../../../themes';
import { ScreenWidth } from '../../utils/dimension/Divices';
import TextNormal from '../Text/TextNormal';
import * as Animatable from "react-native-animatable";

const SocialButton = ({ style, text, textStyle, onPress, background, ico }) => {
    return (
        <Animatable.View animation="flipInY" style={[styles.default, style, { backgroundColor: background }]}>
            <TouchableOpacity
                style={[styles.default, style, { backgroundColor: background }]}
                onPress={onPress}>
                    {ico}
                <TextNormal text={text} style={[styles.text, textStyle]} />
                
            </TouchableOpacity>
        </Animatable.View>
    );
};


export default SocialButton;

const styles = StyleSheet.create({
    default: {
        padding: SPACINGS.default,
        flexDirection: "row",
        height: SIZES.button.height,
        width: ScreenWidth * 0.42,
        borderRadius: SIZES.button.borderRadius,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    text: {
        color: colors.whiteTransparent,
        fontSize: FONTSIZES.xLarge,
        marginLeft: SPACINGS.default
    }
})