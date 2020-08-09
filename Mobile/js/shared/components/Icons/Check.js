/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { colors } from '../../utils/colors/colors';
import { SIZES } from '../../../themes';
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import * as Animatable from "react-native-animatable";

const Check = ({ color, size }) => {
    return (
        <Animatable.View animation="bounceIn">
            <SimpleLineIcons name="check" size={size || SIZES.ico.size} color={color || colors.whiteTransparent} />
        </Animatable.View>
    );
};


export default Check;
