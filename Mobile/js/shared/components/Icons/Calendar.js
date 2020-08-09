/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { colors } from '../../utils/colors/colors';
import { SIZES } from '../../../themes';
import FontAwesome from "react-native-vector-icons/FontAwesome";

const Calendar = ({ color, size }) => {
    return (
        <FontAwesome name={"calendar"} size={size || SIZES.ico.size} color={color || colors.white} />
    );
};


export default Calendar;
