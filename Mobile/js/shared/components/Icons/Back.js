/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { colors } from '../../utils/colors/colors';
import { SIZES, SPACINGS, RADIUS } from '../../../themes';
import AntDesign from "react-native-vector-icons/AntDesign";
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { NavigationService } from '../../../navigation';
import { containerStyle } from '../../../themes/styles';

const Back = ({ color, size, props, onPress, style, force }) => {
    return (
        <TouchableOpacity
            style={[styles.container, containerStyle.shadow, props ? { backgroundColor: props.theme.colorsApp.backgroundBackBtn, borderColor: props.theme.colorsApp.borderColor } : {}, style]}
            onPress={onPress ? onPress : () => { NavigationService.goBack() }}>
            <AntDesign name="arrowleft" size={size || SIZES.back.size} color={force && force ? color : (props ? props.theme.colorsApp.iconColor : colors.whiteTransparent)} />
        </TouchableOpacity >
    );
};


export default Back;

const styles = StyleSheet.create({
    container: {
        borderRadius: RADIUS.backIco,
        width: SIZES.back.width,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        height: SIZES.back.height,
    }
})