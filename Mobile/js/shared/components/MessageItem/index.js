import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {TimeHelper} from '../../../shared/utils/helper/timeHelper';
import {SPACINGS} from '../../../themes';
import {containerStyle} from '../../../themes/styles';
import {colors} from '../../utils/colors/colors';
import fonts from '../../utils/fonts/fonts';
import icons from '../../utils/icons/icons';
import Constant from '../../utils/constant/Constant';
import IALocalStorage from '../../utils/storage/IALocalStorage';
import LogManager from '../../utils/logging/LogManager';
import * as Animatable from 'react-native-animatable';
import { Base64 } from 'js-base64';
import FastImage from 'react-native-fast-image';

const MessageItem = ({item, onItemPress, index, currentUser}) => {
	return (
		<Animatable.View animation="slideInLeft" delay={index * 200}>
			<View style={{backgroundColor: colors.whiteTransparent}}>
				<TouchableOpacity
					onPress={() => onItemPress && onItemPress(item)}
					style={styles.container}
					key={index}>
					<View style={styles.avatarContainer}>
						<FastImage
							cache={FastImage.cacheControl.cacheOnly}
							key={item?.userId}
							source={{uri: item?.user?._id !== currentUser?.userId ? item?.user?.avatar : item?.toUserDetail?.avatar || Constant.MOCKING_DATA.PLACE_HOLDER}}
							style={styles.avatar} />
					</View>
					<View style={styles.nameContainer}>
						<Text style={[containerStyle.textDefault, styles.name]}>
							{item?.user?._id !== currentUser?.userId ? item?.user?.name : item?.toUserDetail?.name}
						</Text>
						<Text numberOfLines={3} style={[containerStyle.textDefaultNormal]}>
							{item?.text}
						</Text>
						<View style={styles.avatarContainerSmall}>
							<FastImage
								cache={FastImage.cacheControl.cacheOnly}
								key={item?.userId}
								source={{uri: item?.user?.avatar || Constant.MOCKING_DATA.PLACE_HOLDER}}
								style={styles.avatarSmall} />
						</View>
					</View>
					<Text style={styles.timeText}>
						{TimeHelper.dateFromNow(item?.createdOn)}
					</Text>
					<Image style={styles.lineView} />
				
				</TouchableOpacity>
			
			</View>
		</Animatable.View>
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
		padding: 10,
		paddingVertical: 7.5,
		backgroundColor: colors.whiteTransparent
	},
	nameContainer: {
		width: '50%',
		marginLeft: 16
	},
	avatarContainer: {
		borderRadius: 58 / 2,
		width: 58,
		height: 58,
		alignItems: 'center',
		justifyContent: 'center'
	},
	avatarContainerSmall: {
		borderRadius: 10,
		width: 20,
		height: 20,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 10
	},
	avatar: {
		borderRadius: 58 / 2,
		width: 58,
		height: 58,
	},
	avatarSmall: {
		borderRadius: 10,
		width: 20,
		height: 20,
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

export default MessageItem;