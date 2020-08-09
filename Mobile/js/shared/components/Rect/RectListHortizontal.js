/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, ScrollView } from 'react-native';
import { containerStyle } from '../../../themes/styles';
import TextNormal from '../Text/TextNormal';
import RectViewRounded from './RectViewRounded';
import ViewIcon from '../Icons/ViewIcon';
import Line from '../Icons/Line';
import ImageScreenShot from '../Avatar/ImageScreenShot';
import LogManager from '../../utils/logging/LogManager';

const renderDetail = (titleSecond, ico, props, data, text1, text2) => {
    return (
        <View>
            <View style={[containerStyle.horContainerWithCenterDefault, containerStyle.paddingAvg]}>
                <ViewIcon props={props} ico={ico} />
                <TextNormal props={props} text={`${titleSecond}`} style={[containerStyle.textHeaderSmall, containerStyle.defaultTextMarginLeft]} />
            </View>
            <Line />
            <View style={[containerStyle.smallMarginTop, containerStyle.paddingAvg]}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {(data && Array.isArray(data) && data || []).map(item => {
                        return (
                            <View style={[containerStyle.horContainerNearlyDefault]}>
                                <ImageScreenShot props={props} uri={item} style={containerStyle.attachment} />
                            </View>
                        )
                    })}
                </ScrollView>
                <TextNormal numberOfLines={2} props={props} text={`${text1}`} style={[containerStyle.textDefault, containerStyle.smallMarginTop]} />
                <TextNormal numberOfLines={2} props={props} text={`${text2}`} style={[containerStyle.textContent, containerStyle.smallMarginTop]} />
            </View>
        </View>
    )
}
const RectListHorizontal = ({ props, title, titleSecond, data, ico, text1, text2 }) => {
    return (
        <View style={!title ? containerStyle.defaultMarginTop : {}}>
            {title ? <TextNormal props={props} text={`${title}`} style={[containerStyle.textHeaderSmall, containerStyle.defaultMarginTop, containerStyle.defaultMarginBottom]} /> : null}
            <RectViewRounded props={props} children={renderDetail(titleSecond, ico, props, data, text1, text2)} style={containerStyle.paddingZero} />
        </View>
    );
};


export default RectListHorizontal;
