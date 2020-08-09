/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { colors } from '../../utils/colors/colors';
import { SIZES, SPACINGS, RADIUS } from '../../../themes';
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { NavigationService } from '../../../navigation';

const LocationIcon = ({ color, size, props }) => {
    return (
        <SimpleLineIcons name="location-pin" size={size || SIZES.back.size} color={props ? props.theme.colorsApp.iconColor : colors.white} />
    );
};


export default LocationIcon;

const styles = StyleSheet.create({
    container: {
        borderColor: colors.gray_bg,
        borderWidth: 0.5,
        borderRadius: RADIUS.backIco,
        width: SIZES.back.width,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        height: SIZES.back.height,
    }
})