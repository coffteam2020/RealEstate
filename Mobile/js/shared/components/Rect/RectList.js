/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View } from 'react-native';
import { containerStyle } from '../../../themes/styles';
import TextNormal from '../Text/TextNormal';
import RectViewRounded from './RectViewRounded';
import ViewIcon from '../Icons/ViewIcon';
import Line from '../Icons/Line';
import ImageScreenShot from '../Avatar/ImageScreenShot';
import LogManager from '../../utils/logging/LogManager';

const renderDetail = (titleSecond, ico, props, data) => {
    return (
        <View>
            <View style={[containerStyle.horContainerWithCenterDefault, containerStyle.paddingAvg]}>
                <ViewIcon props={props} ico={ico} />
                <TextNormal props={props} text={`${titleSecond}`} style={[containerStyle.textHeaderSmall, containerStyle.defaultTextMarginLeft]} />
            </View>
            <Line />
            <View style={[containerStyle.smallMarginTop, containerStyle.paddingAvg]}>
                {(data && Array.isArray(data) && data || []).map(item => {
                    return (
                        <View style={[containerStyle.horContainerNearlyDefault]}>
                            <ImageScreenShot props={props} uri={item.img} style={containerStyle.medicalImg} />
                            <View style={containerStyle.centerNotFlexWithoutSelf}>
                                <TextNormal numberOfLines={2} props={props} text={`${item.medicalSchool}`} style={[containerStyle.textDefault]} />
                                <TextNormal numberOfLines={2} props={props} text={`${item.educated}`} style={[containerStyle.textContent, containerStyle.smallMarginTop]} />
                                <TextNormal numberOfLines={2} props={props} text={`${item.year}`} style={[containerStyle.textContent, containerStyle.smallMarginTop]} />
                            </View>
                        </View>
                    )
                })}
            </View>
        </View>
    )
}
const RectList = ({ props, title, titleSecond, data, ico }) => {
    return (
        <View style={!title ? containerStyle.defaultMarginTop : {}}>
            {title ? <TextNormal props={props} text={`${title}`} style={[containerStyle.textHeaderSmall, containerStyle.defaultMarginTop, containerStyle.defaultMarginBottom]} /> : null}
            <RectViewRounded props={props} children={renderDetail(titleSecond, ico, props, data)} style={containerStyle.paddingZero} />
        </View>
    );
};


export default RectList;
