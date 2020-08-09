/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { colors } from '../../utils/colors/colors';
import { View, StyleSheet } from 'react-native';

const Line = ({ props, style, color, height }) => {
    return (
        <View style={[styles.line, props ? { backgroundColor: props.theme.colorsApp.textColor } : {}, color ? { backgroundColor: color } : {}, height ? { height: height } : {}, style]}></View>
    );
};

export default Line;

const styles = StyleSheet.create({
    line: {
        height: 1,
        backgroundColor: colors.black_five,
        width: "100%"
    }
})