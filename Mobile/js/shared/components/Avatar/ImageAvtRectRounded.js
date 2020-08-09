/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FastImage from 'react-native-fast-image';
import {containerStyle} from '../../../themes/styles';

const ImageAvtRectRounded = ({uri, size, clickable, onPress, style, icon, resizeMode}) => {
	return (
		<TouchableOpacity disabled={!clickable} onPress={onPress}>
			<Animatable.View animation="fadeIn">
				<FastImage
					style={[containerStyle.avatarDefault, styles.avt, style]}
					source={{
						uri: uri,
						priority: FastImage.priority.high,
					}}
					cache={FastImage.cacheControl.cacheOnly}
					resizeMode={resizeMode || FastImage.resizeMode.contain}
				/>
			</Animatable.View>
			{icon && <View style={styles.icon}>{icon}</View>}
		</TouchableOpacity>
	);
};

export default ImageAvtRectRounded;
const styles = StyleSheet.create({
	avt: {
		alignSelf: 'center'
	},
	icon: {
		position: 'absolute',
		right: 0,
		bottom: 0,
	}
});
