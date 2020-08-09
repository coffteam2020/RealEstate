/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Animated, View, TouchableOpacity, StyleSheet, } from 'react-native';
import PropTypes from 'prop-types';
import fonts from '../../utils/fonts/fonts';
import { colors } from '../../utils/colors/colors';
import { SPACINGS, FONTSIZES, SIZES } from '../../../themes';
import { ScreenWidth } from '../../utils/dimension/Divices';
import TextNormal from '../Text/TextNormal';
import * as Animatable from "react-native-animatable";
import ImageScreenShot from '../Avatar/ImageScreenShot';
import { containerStyle } from '../../../themes/styles';
import icons from '../../utils/icons/icons';
import { useTranslation } from 'react-i18next';
import CareTeamVerification from './CareTeamVerification';
import { useObserver } from 'mobx-react';
import { NavigationService } from '../../../navigation';
import { ScreenNames } from '../../../route/ScreenNames';

const DoctorItem = ({ onPress, item, index, props, style, isCareTeam}) => {
    const { t } = useTranslation();
    return useObserver(() => (
        <TouchableOpacity onPress={onPress}>
            <Animatable.View key={item.id} animation="fadeIn" delay={index * 400} style={[containerStyle.horContainerNearlyDefault, containerStyle.paddingAvg, style]}>
                <View>
                    <ImageScreenShot uri={item.avatar} style={containerStyle.doctorAvt} />
                    {isCareTeam && isCareTeam ?
                        <CareTeamVerification />
                        : null}
                </View>
                <View style={containerStyle.defaultTextMarginLeft}>
                    <TextNormal props={props} text={`${item.firstName}` + " " + `${item.lastName}`} style={[containerStyle.textDefault, { color: colors.blue_dodger }]} />
                    <TextNormal numberOfLines={2} props={props} text={`${t("treatment." + item.topic)}`} style={[containerStyle.textContent, styles.treatment, containerStyle.defaultMarginTopSmall]} />
                    <View style={[containerStyle.horContainerWithCenterDefault, containerStyle.defaultMarginTopSmall]}>
                        {icons.IC_RATE}
                        <TextNormal props={props} text={`${item.rating}`} style={[containerStyle.textDefault, containerStyle.defaultTextMarginLeft]} />
                        <TextNormal props={props} text={`(${item.reviews && item.reviews.length || 0} ${t("doctorSearch.reviews")})`} style={[containerStyle.textContent, containerStyle.defaultTextMarginLeft]} />
                    </View>
                    <TextNormal numberOfLines={2} props={props} text={`${item.address}`} style={[containerStyle.textContent, styles.address, containerStyle.defaultMarginTopSmall]} />
                    <View style={[containerStyle.horContainerWithCenterDefault, containerStyle.defaultMarginTopSmall]}>
                        <TouchableOpacity>
                            {icons.NOTIFICATION_STATUS_APPOINTMENT}
                        </TouchableOpacity>
                        <TouchableOpacity style={containerStyle.defaultTextMarginLeft} onPress={() => NavigationService.navigate(ScreenNames.MessageScreen, {item: item})}>
                            {icons.NOTIFICATION_STATUS_MESSAGE}
                        </TouchableOpacity>
                        <TouchableOpacity style={containerStyle.defaultTextMarginLeft}>
                            {icons.NOTIFICATION_STATUS_GOT_CALL}
                        </TouchableOpacity>
                    </View>
                </View>
            </Animatable.View>
        </TouchableOpacity>
    ));
};


export default DoctorItem;

const styles = StyleSheet.create({
    treatment: {
        width: ScreenWidth * 0.6
    },
    address: {
        width: ScreenWidth * 0.57
    }
})