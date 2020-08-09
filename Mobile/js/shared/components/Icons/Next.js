/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { colors } from '../../utils/colors/colors';
import { SIZES } from '../../../themes';
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";

const Next = ({ color, size, isFontAwesome }) => {
    if (isFontAwesome && isFontAwesome) {
        return (
            <Ionicons name={"ios-arrow-forward"} size={size || SIZES.ico.size} color={color || colors.white} />
        )
    }
    return (
        <AntDesign name={"arrowright"} size={size || SIZES.ico.size} color={color || colors.white} />
    );
};


export default Next;
