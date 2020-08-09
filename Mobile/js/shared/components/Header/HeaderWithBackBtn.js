/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { colors } from '../../utils/colors/colors';
import { SIZES, SPACINGS, RADIUS } from '../../../themes';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { StyleSheet, View, TouchableOpacity, Platform } from 'react-native';
import { NavigationService } from '../../../navigation';
import icons from '../../utils/icons/icons';
import { ScreenWidth, ScreenHeight } from '../../utils/dimension/Divices';
import Back from '../Icons/Back';
import * as devices from '../../utils/device/device';
import TextNormal from '../Text/TextNormal';
import { containerStyle } from '../../../themes/styles';

const HeaderWithBackBtn = ({ props, title, hasButton = false, rightTitleChildren, onPressRight }) => {
	return (
		<View
			style={[styles.container]}>
			<Back props={props} />
			<View style={styles.text}>
				<TextNormal numberOfLines={2} props={props} style={[containerStyle.textHeader]} text={title} />
			</View>
			<View style={{ width: SIZES.back.width, height: SIZES.back.height, }}>
				{hasButton && hasButton ?
					<TouchableOpacity style={styles.text} onPress={onPressRight}>
						<TextNormal numberOfLines={2} props={props} style={[containerStyle.textDefaultNormal]} text={rightTitleChildren} />
					</TouchableOpacity> : null}
			</View>
		</View>
	);
};


export default HeaderWithBackBtn;

const styles = StyleSheet.create({
	container: {
		borderRadius: RADIUS.backIco,
		width: ScreenWidth - 40,
		height: ScreenHeight / 12,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignContent: 'center',
		alignItems: 'center',
		margin: 20,
		marginTop: Platform.OS === 'android' ? 10 : 0,
		marginBottom: 0,
	},
	text: {
		width: ScreenWidth * 0.6,
		height: SIZES.back.height,
		alignSelf: 'center',
		alignItems: 'center',
		justifyContent: 'center',
		alignContent: 'center'
	}
});