/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import icons from '../../utils/icons/icons';
import TextNormal from '../Text/TextNormal';
import * as Animatable from "react-native-animatable";
import { useTranslation } from 'react-i18next';
import { containerStyle } from '../../../themes/styles';
import { SPACINGS } from '../../../themes';

const Empty = ({ props, text }) => {
    const { t } = useTranslation();
    return (
        <View style={[styles.container]}>
            <Animatable.View animation="swing" iterationCount={2} duration={3000}>
                {props.theme.dark ? icons.IC_EMPTY_BLACK : icons.IC_EMPTY_WHITE}
            </Animatable.View>
            <TextNormal numberOfLines={3} text={text} props={props} style={[containerStyle.textDefault, containerStyle.defaultPadding, containerStyle.textCenter]} />
        </View >
    );
};


export default Empty;

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        alignSelf: "center",
        flex: 1,
        marginBottom: SPACINGS.superLarge
    }
})