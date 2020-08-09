/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View } from 'react-native';
import { containerStyle } from '../../../themes/styles';
import TextNormal from '../Text/TextNormal';
import RectViewRounded from './RectViewRounded';
import ViewIcon from '../Icons/ViewIcon';
import Line from '../Icons/Line';

const renderDetail = (titleSecond, ico, props, titleText1, titleText2, text1, text2, styleSecond) => {
    return (
        <View>
            <View style={[containerStyle.horContainerWithCenterDefault, containerStyle.paddingAvg]}>
                <ViewIcon props={props} ico={ico} />
                <TextNormal props={props} text={`${titleSecond}`} style={[containerStyle.textHeaderSmall, containerStyle.defaultTextMarginLeft]} />
            </View>
            <Line />
            <View style={[containerStyle.smallMarginTop, containerStyle.paddingAvg]}>
                <TextNormal numberOfLines={4} props={props} text={`${titleText1}`} style={[containerStyle.textContent, containerStyle.smallMarginTop]} />
                <TextNormal numberOfLines={4} props={props} text={`${text1}`} style={[containerStyle.textDefault, containerStyle.smallMarginTop]} />
                <TextNormal numberOfLines={4} props={props} text={`${titleText2}`} style={[containerStyle.textContent, containerStyle.smallMarginTop]} />
                <TextNormal numberOfLines={4} props={props} text={`${text2}`} style={[containerStyle.textDefault, containerStyle.smallMarginTop]} />
            </View>
        </View>
    )
}
const RectInformationArrayManual = ({ props, title, titleSecond, data, ico, styleSecond, titleText1, titleText2, text1, text2 }) => {
    return (
        <View style={!title ? containerStyle.defaultMarginTop : {}}>
            {title ? <TextNormal props={props} text={`${title}`} style={[containerStyle.textHeaderSmall, containerStyle.defaultMarginBottom]} /> : null}
            <RectViewRounded props={props} children={renderDetail(titleSecond, ico, props, titleText1, titleText2, text1, text2, styleSecond)} style={containerStyle.paddingZero} />
        </View>
    );
};


export default RectInformationArrayManual;
