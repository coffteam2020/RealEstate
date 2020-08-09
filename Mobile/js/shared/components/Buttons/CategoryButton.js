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
import { containerStyle } from '../../../themes/styles';

const CategoryButton = ({ props, style, text, textStyle, onPress, ico }) => {
    return (
        <Animatable.View animation="flipInY" style={[styles.default, containerStyle.shadow, style,
        { backgroundColor: props.theme.colorsApp.backgroundInput }]}>
            <TouchableOpacity
                style={[styles.default, style,
                { backgroundColor: props.theme.colorsApp.backgroundInput }]}
                onPress={onPress}>
                <Animatable.View animation="pulse" iterationCount={"infinite"} iterationDelay={2000} delay={15000}>
                    {ico}
                </Animatable.View>
                <TextNormal props={props} numberOfLines={2} text={text} style={[styles.text, textStyle]} />
            </TouchableOpacity>
        </Animatable.View>
    );
};


export default CategoryButton;

const styles = StyleSheet.create({
    default: {
        padding: SPACINGS.default,
        height: SIZES.categoryButton.height,
        width: SIZES.categoryButton.width,
        borderRadius: SIZES.categoryButton.borderRadius,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
    },
    text: {
        fontSize: FONTSIZES.default,
        textAlign: "center",
        fontFamily: fonts.family.nunito.medium,
        marginTop: SPACINGS.default
    }
})