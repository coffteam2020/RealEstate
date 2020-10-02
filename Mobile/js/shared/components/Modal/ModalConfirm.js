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
import GradientButton from '../../../shared/components/Buttons/GradientButton';

const ModalConfirm = ({isVisible, onPress, title, subTitle, style, onClose, secondSubTitle, hasIco = false, ico, icoPress}) => {
	const {t} = useTranslation();
	return (
    <Modal
      isVisible={isVisible}
      animationIn="fadeIn"
      animationInTiming={800}
      animationOutTiming={1000}>
      <View style={[styles.container, containerStyle.shadow, style]}>
        <View style={styles.header}>
          <View style={[containerStyle.centerNotFlex, {width: '90%'}]}>
            <TextNormal
              text={title}
              style={[
                containerStyle.textHeader,
                containerStyle.textCenter,
                containerStyle.largeTextMargin,
                containerStyle.textDefault,
              ]}
            />
			<TextNormal
              text={subTitle}
              style={[
				containerStyle.textCenter,
				styles.textSubTitle
              ]}
            />
			{(secondSubTitle || hasIco ) && <View style={styles.secondSub}>
				{secondSubTitle && (<Text>{secondSubTitle}</Text>)}
				{hasIco && (<TouchableOpacity onPress={() => icoPress()}>{ico}</TouchableOpacity>)}
			</View>}
            
			
          </View>
        </View>
        <View
          style={styles.buttonWrapper}>
          <GradientButton
            onPress={() => onPress()}
            style={styles.confirmButton}
            onPress={() => onPress()}
            text={t('common.confirm')}
          />
          <GradientButton
            onPress={() => onClose()}
            style={[styles.confirmButton, {backgroundColor: colors.red}]}
            isFullBackground={true}
            onPress={() => onClose()}
            text={t('common.cancel')}
            textStyle={{color: colors.purpleMain}}
            fromColor={colors.gray_bg_new}
            toColor={colors.gray_bg_new}
          />
        </View>
      </View>
    </Modal>
  );
};

export default ModalConfirm;

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
	},
	buttonWrapper:{
		marginBottom: SPACINGS.xLarge,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-evenly',
	},
	confirmButton: {
		borderRadius: 40,
		marginTop: 10,
		width: ScreenWidth / 3
	},
	textSubTitle:{
		fontSize: FONTSIZES.avg,
		marginBottom: SPACINGS.large
	},
	secondSub:{
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-evenly"
	}

});