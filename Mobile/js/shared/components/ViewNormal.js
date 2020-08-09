/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { withTheme } from 'react-native-paper';
import LogManager from '../utils/logging/LogManager';

const ViewNormal = (props) => {
    return (
        <View style={{flex: 1, backgroundColor:'white'}} {...props}/>
    );
};


export default withTheme(ViewNormal);

const styles = StyleSheet.create({
    default: {
        flex: 1
    }
})
