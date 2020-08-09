/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {colors} from '../../utils/colors/colors';
import {RADIUS, SPACINGS} from '../../../themes';
import {StyleSheet, View} from 'react-native';
import {ScreenWidth} from '../../utils/dimension/Divices';
import {containerStyle} from '../../../themes/styles';
import {useTranslation} from 'react-i18next';
import Modal from 'react-native-modal';
import TextNormal from '../Text/TextNormal';
import icons from '../../utils/icons/icons';
import GradientButton from '../Buttons/GradientButton';

const ModalPingMessage = ({isVisible, onPress, title, subTitle, style, styleSubtitle}) => {
	const {t} = useTranslation();
	return (
		<Modal isVisible={isVisible} animationIn="fadeIn" animationOut="fadeOut" animationInTiming={800} animationOutTiming={1000}>
			<View style={[styles.container, containerStyle.shadow, style]}>
				<View style={[containerStyle.centerNotFlex, {width: '100%'}]}>
					<TextNormal numberOfLines={2} text={title || ''} style={[containerStyle.textHeader, containerStyle.textCenter, containerStyle.largeTextMargin]} />
					<TextNormal numberOfLines={6} text={subTitle || ''} style={[containerStyle.textNormalBlackLarge, containerStyle.textCenter, styleSubtitle]} />
				</View>
				<View style={[{marginTop: 50}]}>
					<GradientButton onPress={onPress} text={'Got it'} style={[containerStyle.buttonHalf, containerStyle.buttonCenter, {borderRadius: 30, width: ScreenWidth * 0.6}]} />
				</View>
			</View>
		</Modal>
	);
};


export default ModalPingMessage;

const styles = StyleSheet.create({
	container: {
		borderRadius: RADIUS.backIco,
		width: ScreenWidth * 0.9,
		height: ScreenWidth * 0.6,
		padding: SPACINGS.default,
		backgroundColor: colors.whiteTransparent,
		alignContent: 'center',
		alignSelf: 'center',
		justifyContent: 'center'
	}
});