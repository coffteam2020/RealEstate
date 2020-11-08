/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {colors} from '../../utils/colors/colors';
import {FONTSIZES, RADIUS, SPACINGS} from '../../../themes';
import {Button, StyleSheet, TouchableOpacity, Text, View, Platform} from 'react-native';
import {ScreenHeight, ScreenWidth} from '../../utils/dimension/Divices';
import {containerStyle} from '../../../themes/styles';
import Modal from 'react-native-modal';
import TextNormal from '../Text/TextNormal';
import {useTranslation} from 'react-i18next';

const ModalAccount = ({isVisible, onPress, title, style, onClose}) => {
	const {t} = useTranslation();
	const [islogOut, setIslogOut] = useState(false);
	const [selectedIndex, setSelectIndex] = useState(0);

	useEffect(() => {
		if(title === 'LOGOUT'){
			setIslogOut(true);
		}
	}, [title]);


	let stringTitle, subTitle;
	switch (title) {
	case 'LOGOUT':
		stringTitle = t('common.confirm');
		subTitle = t('common.logout');
		
		break;
	default:
		stringTitle = '';
		subTitle = '';
	}
	return (
		<Modal isVisible={isVisible} animationIn="fadeIn" animationInTiming={800}
			animationOutTiming={1000}>
			<View style={[styles.container, containerStyle.shadow, style]}>
				<View style={styles.header}>
					<View style={[containerStyle.centerNotFlex, {width: '90%'}]}>
						<TextNormal text={stringTitle}
							style={[containerStyle.textHeader, containerStyle.textCenter, containerStyle.largeTextMargin, containerStyle.textDefault]} />
						<Text>{subTitle}</Text>
					</View>
				</View>
				{islogOut && <View style={styles.actionButton}>
					<TouchableOpacity onPress={() => {
							onPress()}}
						style={[styles.yesButton]}>
						<TextNormal text={"Yes"} style={styles.text}/>
					</TouchableOpacity>
					<TouchableOpacity 
						onPress={() => onClose()}
						style={[styles.noButton]}>
						<TextNormal text={"No"} style={[styles.text, {color: colors.red}]} />
					</TouchableOpacity>
				</View>}
			</View>
		</Modal>
	);
};

export default ModalAccount;

const styles = StyleSheet.create({
	container: {
		borderRadius: RADIUS.backIco,
		width: ScreenWidth * 0.8,
		backgroundColor: colors.whiteTransparent,
		alignSelf: 'center',
		justifyContent: 'flex-end',
		flexDirection: "column",
	},
	header:{
		marginTop: SPACINGS.xLarge,
		padding: SPACINGS.default,
	},
	content: {
	},
	rowData:{
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		margin: SPACINGS.small,
		borderBottomColor: colors.gray,
		borderBottomWidth: 1
	},
	actionButton: {
		display: "flex",
		flexDirection: "row",
		marginTop: SPACINGS.xxxLarge,
		borderBottomLeftRadius: RADIUS.backIco,
		borderBottomRightRadius: RADIUS.backIco
	},
	yesButton:{
		borderColor: colors.gray,
		borderTopWidth: 1,
		borderRightWidth: 1,
		flex: 1,
	},
	noButton:{
		borderColor: colors.gray,
		borderLeftWidth: 1,
		borderTopWidth: 1,
		flex: 1,
		color: colors.red
	},
	text: {
		alignContent: "center",
		fontSize: FONTSIZES.avg,
		textAlign: "center",
		marginTop: SPACINGS.avg,
		marginBottom: SPACINGS.avg 
	}
});