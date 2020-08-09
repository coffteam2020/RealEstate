/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View } from 'react-native';
import { containerStyle } from '../../../themes/styles';
import TextNormal from '../Text/TextNormal';
import RectViewRounded from './RectViewRounded';
import ViewIcon from '../Icons/ViewIcon';
import Line from '../Icons/Line';

const renderDetail = (onPressText, titleSecond, ico, props, data, styleSecond) => {
    return (
        <View>
            <View style={[containerStyle.horContainerWithCenterDefault, containerStyle.paddingAvg]}>
                <ViewIcon props={props} ico={ico} />
                <TextNormal props={props} text={`${titleSecond}`} style={[containerStyle.textHeaderSmall, containerStyle.defaultTextMarginLeft]} />
            </View>
            <Line />
            <View style={[containerStyle.smallMarginTop, containerStyle.paddingAvg]}>
                <TextNormal clickable={onPressText && onPressText} onPress={onPressText} numberOfLines={100} props={props} text={`${data}`} style={[containerStyle.textDefaultNormal, styleSecond]} />
            </View>
        </View>
    )
}
const RectInformationCommon = ({ clickable, onPressText, props, title, titleSecond, data, ico, styleSecond }) => {
    return (
        <View style={!title ? containerStyle.defaultMarginTop : {}}>
            {title ? <TextNormal props={props} text={`${title}`} style={[containerStyle.textHeaderSmall, containerStyle.defaultMarginBottom]} /> : null}
            <RectViewRounded props={props} children={renderDetail(onPressText, titleSecond, ico, props, data, styleSecond)} style={containerStyle.paddingZero} />
        </View>
    );
};


export default RectInformationCommon;
