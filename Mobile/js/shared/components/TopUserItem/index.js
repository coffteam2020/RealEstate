import React from 'react';
import {useTranslation} from 'react-i18next';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SPACINGS} from '../../../themes';
import {containerStyle} from '../../../themes/styles';
import {colors} from '../../utils/colors/colors';
import Constant from '../../utils/constant/Constant';
import fonts from '../../utils/fonts/fonts';
import FastImage from 'react-native-fast-image';

const TopUserItem = ({item, onItemPress, index, currentUser, style, avatar, name}) => {
	const {t} = useTranslation();
	return (
		<TouchableOpacity
			onPress={() => onItemPress && onItemPress(item)}
			style={[styles.container, style]}
			key={index}>
			<View style={styles.avatarContainer}>
				<FastImage
					cache={FastImage.cacheControl.cacheOnly}
					source={{uri: item?.avatar || avatar || Constant.MOCKING_DATA.PLACE_HOLDER}}
					style={styles.avatar} />
				<View>
					<Text style={[containerStyle.textDefault, styles.name, {
						marginLeft: SPACINGS.small
					}]}>
						{item?.name || name || 'Name'}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		// alignContent: 'center',
		// alignItems: 'center',
		paddingHorizontal: SPACINGS.xxLarge,
		width: '80%',
		justifyContent: 'center',
		alignItems: 'flex-start',
		height: 68,
		// paddingVertical: 7.5,
	},
	nameContainer: {
		width: '50%',
		marginLeft: 16
	},
	avatarContainer: {
		flexDirection: 'row',
		// borderRadius: 40 / 2,
		// width: 40,
		// height: 40,
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

export default TopUserItem;