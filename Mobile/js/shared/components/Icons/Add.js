/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { colors } from '../../utils/colors/colors';
import { SIZES, SPACINGS, RADIUS } from '../../../themes';
import AntDesign from "react-native-vector-icons/AntDesign";
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { NavigationService } from '../../../navigation';
import icons from '../../utils/icons/icons';

const Add = ({props, onPress }) => {
    return (
        <TouchableOpacity
            style={[styles.container, props ? { backgroundColor: props.theme.colorsApp.backgroundHome} : {}]}
            onPress={onPress ? onPress : () => { }}>
            {icons.IC_ADD}
        </TouchableOpacity >
    );
};


export default Add;

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