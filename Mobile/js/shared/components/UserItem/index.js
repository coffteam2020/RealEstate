import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SPACINGS} from '../../../themes';
import {containerStyle} from '../../../themes/styles';
import {colors} from '../../utils/colors/colors';
import Constant from '../../utils/constant/Constant';
import fonts from '../../utils/fonts/fonts';
import LogManager from '../../utils/logging/LogManager';
import FastImage from 'react-native-fast-image';

const UserItem = ({item, onItemPress, index, currentUser, style}) => {
	// console.log(LogManager.parseJsonObjectToJsonString(item))
	return (
		<TouchableOpacity
			onPress={() => onItemPress && onItemPress(item)}
			style={[styles.container, style]}
			key={index}>
			<View style={styles.avatarContainer}>
				<FastImage
					cache={FastImage.cacheControl.cacheOnly}
					source={{uri: item?.avatar || Constant.MOCKING_DATA.PLACE_HOLDER}}
					style={styles.avatar} />
			</View>
			<View style={styles.nameContainer}>
				<Text style={[containerStyle.textDefault, styles.name]}>
					{item?.name || ' '}
				</Text>
			</View>
			<Image style={styles.lineView} />
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'row',
		alignContent: 'center',
		alignItems: 'center',
		paddingHorizontal: SPACINGS.xxLarge,
		width: '100%',
		height: 68,
		paddingVertical: 7.5,
		backgroundColor: colors.whiteTransparent
	},
	nameContainer: {
		width: '50%',
		marginLeft: 16
	},
	avatarContainer: {
		borderRadius: 40 / 2,
		width: 40,
		height: 40,
		alignItems: 'center',
		justifyContent: 'center'
	},
	avatar: {
		borderRadius: 40 / 2,
		width: 40,
		height: 40,
	},
	readMsg: {
		paddingTop: 5,
		color: colors.black_lessy,
	},
	unreadMsg: {
		paddingTop: 5,
		color: colors.textBlue,
	},
	name: {
		color: colors.textBlue,
	},
	timeText: {
		color: colors.textPuple,
		fontSize: 12,
		fontFamily: fonts.family.nunito.regular,
		position: 'absolute',
		right: SPACINGS.xxLarge
	},
	lineView: {
		position: 'absolute',
		bottom: 0,
		height: 2,
		marginLeft: '6%',
		width: '100%',
	},
	dot: {
		position: 'absolute',
		left: SPACINGS.default,
	}
});

export default UserItem;