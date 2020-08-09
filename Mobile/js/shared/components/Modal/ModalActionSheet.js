/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import {FONTSIZES, SPACINGS} from '../../../themes';
import {containerStyle} from '../../../themes/styles';
import {colors} from '../../utils/colors/colors';
import {ScreenHeight, ScreenWidth} from '../../utils/dimension/Divices';
import fonts from '../../utils/fonts/fonts';
import icons from '../../utils/icons/icons';

const OPTIONS = [
	'blockUser',
	'deleteUser',
	'dismiss',
];
const ModalActionSheet = ({isVisible, props, onPress}) => {
	const {t} = useTranslation();
	const [visible, setVisible] = useState(false);
	const renderItem = (item, index) => {
		let icon = icons.IC_REPORT;
		switch (item) {
		case 'blockUser':
			icon = icons.IC_BLOCK;
			break;
		case 'deleteUser':
			icon = icons.IC_DELETE;
			break;
		}
		return (
			<TouchableOpacity
				onPress={()=>onPress && onPress(item, index)}
				style={styles.item}>
				<View style={styles.icon}>
					{icon}
				</View>
				<Text style={styles.text}>{t('message.' + item)}</Text>
			</TouchableOpacity>
		);
	};

	useEffect(() => {
		setVisible(isVisible);
	}, [isVisible]);

	return (
		<Modal
			style={{justifyContent: 'flex-end'}}
			isVisible={visible} animationIn="fadeIn"
			animationOut="fadeOutRightBig"
			animationInTiming={800}
			animationOutTiming={1000}>
			<View style={[styles.container, containerStyle.shadow]}>
				<FlatList
					showsVerticalScrollIndicator={false}
					data={OPTIONS}
					key={(item, index) => item.toString()}
					renderItem={({item, index}) => renderItem(item, index)} />
			</View>
		</Modal>
	);
};


export default ModalActionSheet;

const styles = StyleSheet.create({
	container: {
		borderTopStartRadius: 30,
		borderTopRightRadius: 30,
		width: ScreenWidth,
		height: ScreenHeight * 0.4,
		// padding: SPACINGS.default,
		paddingVertical: SPACINGS.xxxLarge,
		backgroundColor: colors.whiteTransparent,
		alignSelf: 'center',
		alignContent: 'flex-end',
		marginBottom: -20
	},
	item: {
		height: 69,
		flexDirection: 'row',
		width: '100%',
		alignItems: 'center',
		borderBottomColor: colors.borderColor,
		borderBottomWidth: 1,
		paddingHorizontal: SPACINGS.xxLarge
	},
	text: {
		marginLeft: SPACINGS.large,
		color: colors.placeholder,
		fontFamily: fonts.family.nunito.bold,
		fontSize: FONTSIZES.default,
	},
	icon: {
		alignItems: 'center',
		justifyContent: 'center',
		padding: SPACINGS.sSmall,
		width: SPACINGS.xxxLarge
	}
});