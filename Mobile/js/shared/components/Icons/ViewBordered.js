/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { colors } from '../../utils/colors/colors';
import { SIZES, SPACINGS, RADIUS } from '../../../themes';
import AntDesign from "react-native-vector-icons/AntDesign";
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { NavigationService } from '../../../navigation';

const ViewBordered = ({ children, style, props, onPress }) => {
    return (
        <TouchableOpacity
            style={[styles.container, props ? { backgroundColor: props.theme.colorsApp.backgroundBackBtn, borderColor: props.theme.colorsApp.borderColor } : {}, style]}
            onPress={onPress ? onPress : () => { }}>
            {children}
        </TouchableOpacity >
    );
};


export default ViewBordered;

const styles = StyleSheet.create({
    container: {
        borderColor: colors.gray_bg,
        borderWidth: 0.5,
        paddingEnd: SPACINGS.default,
        paddingLeft: SPACINGS.default,
        borderRadius: RADIUS.backIco,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        height: SIZES.back.height,
    }
})