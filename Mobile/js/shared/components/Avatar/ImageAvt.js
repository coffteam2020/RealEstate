/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { colors } from '../../utils/colors/colors';
import { SIZES } from '../../../themes';
import Feather from "react-native-vector-icons/Feather";
import { Avatar } from 'react-native-paper';
import { containerStyle } from '../../../themes/styles';
import { TouchableOpacity } from 'react-native';

const ImageAvt = ({ uri, size, clickable, onPress, style }) => {
    return (
        <TouchableOpacity disabled={!clickable} onPress={onPress}>
            <Avatar.Image size={size || SIZES.avatar.height} style={[containerStyle.shadow, style]} source={{ uri: uri }} />
        </TouchableOpacity>
    );
};

export default ImageAvt;
