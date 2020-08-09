/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { colors } from '../../utils/colors/colors';
import { SIZES } from '../../../themes';
import Feather from "react-native-vector-icons/Feather";
import { Avatar } from 'react-native-paper';
import { containerStyle } from '../../../themes/styles';
import * as Animatable from "react-native-animatable";
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import FastImage from "react-native-fast-image";

const ImageScreenShot = ({ uri, size, clickable, onPress, style }) => {
    return (
        <TouchableOpacity disabled={!clickable} onPress={onPress}>
            <Animatable.View animation="fadeIn">
                <FastImage
                    style={[containerStyle.shadow, containerStyle.imgDefaultScreenshot, styles.avt, style]}
                    source={{
                        uri: uri,
                        priority: FastImage.priority.high,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                />
            </Animatable.View>
        </TouchableOpacity>
    );
};

export default ImageScreenShot;
const styles = StyleSheet.create({
    avt: {
        alignSelf: "center",
    }
})
