/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import * as Animatable from "react-native-animatable";
import { containerStyle } from '../../../themes/styles';
import { images } from '../../../../assets';

const CareTeamVerification = ({ isFull }) => {
    return (
        <Animatable.View animation="flipInY" style={containerStyle.smallMarginTop}>
            <Animatable.Image source={images.careTeam} style={isFull ? containerStyle.careTeamFull : containerStyle.careTeam} resizeMethod="resize" resizeMode="contain" />
        </Animatable.View>
    );
};


export default CareTeamVerification;