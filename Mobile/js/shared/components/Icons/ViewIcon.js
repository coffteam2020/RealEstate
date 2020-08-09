/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { colors } from '../../utils/colors/colors';
import { SIZES, SPACINGS, RADIUS } from '../../../themes';
import AntDesign from "react-native-vector-icons/AntDesign";
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { NavigationService } from '../../../navigation';
import { containerStyle } from '../../../themes/styles';

const ViewIcon = ({ props, ico }) => {
    return (
        <View style={[containerStyle.centerNotFlex, props ? { backgroundColor: props.theme.dark ? "#1C383A" : "#D0F0F0" } : {}, styles.container]}>
            {ico}
        </View>
    );
};


export default ViewIcon;

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        padding: SPACINGS.small
    }
})