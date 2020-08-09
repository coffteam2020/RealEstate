/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { colors } from '../../utils/colors/colors';
import { SIZES, SPACINGS, RADIUS } from '../../../themes';
import Ionicons from "react-native-vector-icons/Ionicons";
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { NavigationService } from '../../../navigation';
import { containerStyle } from '../../../themes/styles';
import { useObserver } from 'mobx-react';
import TextNormal from '../Text/TextNormal';
import * as Animatable from "react-native-animatable";

const Notification = ({ count, size, props, onPress }) => {
    return useObserver(() => (
        <TouchableOpacity
            style={[styles.container, props.theme.dark ? containerStyle.shadow : containerStyle.shadowWhite, props ? { backgroundColor: props.theme.colorsApp.backgroundInput } : {}]}
            onPress={onPress ? onPress : () => { }}>
            <Ionicons name="md-notifications-outline" color={colors.pink} size={size || SIZES.back.size} />
            {count > 0 ?
                <Animatable.View animation={count > 0 ? "swing" : "fadeIn"} iterationCount={count > 0 ? "infinite" : 1} duration={1500} style={{ position: "absolute", top: -7.5, right: -2.5, width: 20, height: 20, borderRadius: 10, backgroundColor: colors.pink }}>
                    <TextNormal props={props} text={`${count ? count : 0}`} style={[containerStyle.textCenter, { color: colors.whiteTransparent }]} />
                </Animatable.View> : null}
        </TouchableOpacity >
    ));
};


export default Notification;

const styles = StyleSheet.create({
    container: {
        borderRadius: RADIUS.backIco,
        width: SIZES.back.width,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        height: SIZES.back.height,
    }
})