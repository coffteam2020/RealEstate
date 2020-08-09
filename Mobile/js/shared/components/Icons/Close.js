/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { colors } from '../../utils/colors/colors';
import { SIZES, SPACINGS, RADIUS } from '../../../themes';
import AntDesign from "react-native-vector-icons/AntDesign";
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { NavigationService } from '../../../navigation';

const Close = ({ color, size, props }) => {
    return (
        <TouchableOpacity style={[styles.container, props ? { backgroundColor: props.theme.colorsApp.backgroundBackBtn, borderColor: props.theme.colorsApp.borderColor } : {}]} onPress={() => { NavigationService.goBack() }}>
            <AntDesign name="close" size={size || SIZES.back.size} color={props ? props.theme.colorsApp.iconColor : colors.whiteTransparent} />
        </TouchableOpacity>
    );
};


export default Close;

const styles = StyleSheet.create({
    container: {
        borderColor: colors.gray_bg,
        borderWidth: 0.5,
        borderRadius: RADIUS.backIco,
        width: SIZES.back.width,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        alignSelf: "center",
        height: SIZES.back.height,
    }
})