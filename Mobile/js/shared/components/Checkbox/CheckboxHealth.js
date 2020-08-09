/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { SPACINGS, SIZES } from '../../../themes';
import TextNormal from '../Text/TextNormal';
import * as Animatable from "react-native-animatable";
import { ScreenWidth } from '../../utils/dimension/Divices';

const CheckboxHealth = ({ props, text, onPress, isChecked }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.container}>
            <TextNormal numberOfLines={2} props={props} text={text} />
            <View style={[styles.containerCheckbox, { borderColor: props.theme.colorsApp.borderColor }]}>
                {isChecked && isChecked ?
                    <Animatable.View animation="flipInX">
                        <FontAwesome5 name="check" color={props.theme.colorsApp.iconColor} size={15} />
                    </Animatable.View>
                    : null}
            </View>
        </TouchableOpacity>
    );
};


export default CheckboxHealth;

const styles = StyleSheet.create({
    containerCheckbox: {
        borderWidth: 0.5,
        borderRadius: 8,
        height: SIZES.checkbox.height,
        width: SIZES.checkbox.width,
        justifyContent: "center",
        alignItems: "center"
    },
    container: {
        height: SIZES.button.height,
        flexDirection: "row",
        alignItems: "center",
        alignSelf: 'center',
        justifyContent: "space-between",
        width: ScreenWidth - SPACINGS.xLarge * 2
    }
})