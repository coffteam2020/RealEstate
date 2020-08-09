/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { colors } from '../../utils/colors/colors';
import { SIZES } from '../../../themes';
import Feather from "react-native-vector-icons/Feather";

const Eye = ({ color, size, isOff }) => {
    return (
        <Feather name={isOff && isOff ? "eye" : "eye-off"} size={size || SIZES.ico.size} color={color || colors.white} />
    );
};


export default Eye;
