/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {colors} from '../../utils/colors/colors';
import {FONTSIZES, RADIUS, SPACINGS} from '../../../themes';
import {StyleSheet, TouchableOpacity, Text, View, Platform} from 'react-native';
import {ScreenHeight, ScreenWidth} from '../../utils/dimension/Divices';
import {containerStyle} from '../../../themes/styles';
import Modal from 'react-native-modal';
import TextNormal from '../Text/TextNormal';
import GradientButton from '../Buttons/GradientButton';
import ImageAvtRectRounded from '../Avatar/ImageAvtRectRounded';
import Constant from '../../utils/constant/Constant';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import {useObserver} from 'mobx-react';
import {useStores} from '../../../store/useStore';
import IALocalStorage from '../../utils/storage/IALocalStorage';
import AxiosFetcher from '../../../api/AxiosFetch';
import {ToastHelper} from '../ToastHelper';
import Empty from '../Empty';
import Loading from '../Loading';
import AudioRecord from 'react-native-audio-record';
import {Buffer} from 'buffer';
import Permissions from 'react-native-permissions';
import moment from 'moment';
import {uploadFileToFireBase} from '../../utils/firebaseStorageUtils';
import TrackPlayer from 'react-native-track-player';
import {useTranslation} from 'react-i18next';
import Wave from '../Wave';
const options = {
	sampleRate: 16000,  // default 44100
	channels: 1,        // 1 or 2, default 1
	bitsPerSample: 16,  // 8 or 16, default 16
	audioSource: 6,     // android only (see below)
	wavFile: 'test.wav' // default 'audio.wav'
};
AudioRecord.init(options);

AudioRecord.on('data', data => {
	const chunk = Buffer.from(data, 'base64');
	console.log('chunk size', chunk.byteLength);
});

const ModalWave = ({isVisible, title, subTitle, style, onUse, onRecord, onSuccess, onClose, used = 1, time}) => {
	return useObserver(() => (
		<Modal isVisible={isVisible} animationIn="fadeIn" animationInTiming={800}
			animationOutTiming={1000}>
			<View style={[styles.container, containerStyle.shadow, style]}>
				<TouchableOpacity onPress={onClose} >
					<AntDesign name="close" size={25} color={colors.black}/>
				</TouchableOpacity>
                <TouchableOpacity onPress={onSuccess} style={{position: 'absolute', top: 10, right: 10}}>
					<Entypo name="check" size={25} color={colors.black}/>
				</TouchableOpacity>
				<View style={[containerStyle.centerNotFlex, {width: '90%'}]}>
					<TextNormal text={title}
						style={[containerStyle.textHeader, containerStyle.textCenter, containerStyle.largeTextMargin, containerStyle.textDefault]}/>
					<Text>{subTitle}</Text>
				</View>
				<Text style={{fontSize: FONTSIZES.xLarge, fontWeight: 'bold', textAlign: 'center', marginTop: 15, marginBottom: -50}}> {`${moment.utc(time * 1000).format('mm:ss')}`} </Text>
				<Wave />
				<View style={{width: '99%', backgroundColor: colors.white, height: 10, borderRadius: 15}}>
					<View style={{width: `${used}%`, backgroundColor: colors.green, height: 10, borderRadius: 15}}>
						
					</View>
					<View style={[{width: 10, height: 10, borderRadius: 5, backgroundColor: Constant.COLOR_BACKGROUND_BTN[0], left: `${used -3}%`, marginTop: -10}, containerStyle.shadow]}>
					</View>
				</View>
				<View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
					<TextNormal text={'1m'}/>
					<TextNormal text={'15m'}/>
					<TextNormal text={'30m'}/>
				</View>
			</View>
		</Modal>
	));
};


export default ModalWave;

const styles = StyleSheet.create({
	item: {
		flexDirection: 'row',
		paddingRight: 10,
		paddingTop: 20,
		paddingLeft: 10,
		borderBottomColor: colors.borderColor,
		borderBottomWidth: 0.5,
		alignContent: 'center',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	container: {
		paddingBottom: 40,
		borderRadius: RADIUS.backIco,
		width: ScreenWidth * 0.8,
		padding: SPACINGS.default,
		backgroundColor: colors.whiteTransparent,
		alignContent: 'center',
		alignSelf: 'center',
		justifyContent: 'center'
	}
});