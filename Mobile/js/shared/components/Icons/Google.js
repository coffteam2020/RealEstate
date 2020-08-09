/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { colors } from '../../utils/colors/colors';
import { SIZES } from '../../../themes';
import Entypo from "react-native-vector-icons/Entypo";

const Google = ({ color, size}) => {
    return (
        <Entypo name="google--with-circle" size={size || SIZES.ico.size} color={color || colors.whiteTransparent}/>
    );
};


export default Google;
