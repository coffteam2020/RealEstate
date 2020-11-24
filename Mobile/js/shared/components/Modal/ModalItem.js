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
import LogManager from '../../utils/logging/LogManager';
import {ScrollView} from 'react-native-gesture-handler';
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
	// console.log('chunk size', chunk.byteLength);
});

const ModalItem = ({isVisible, onPress, title, style, onUse, onRecord, onClose}) => {
	const {t} = useTranslation();

	const {userStore} = useStores();
	const [isLoading, setIsLoading] = useState(false);
	const [recording, setRecording] = useState(false);
	const [audioFile, setAudioFile] = useState('');
	const [time, setTime] = useState(0);
	const [timeInterval, setTimeInterval] = useState(0);

	useEffect(() => {
		getItemsBought();
	}, [title]);

	useEffect(() => {
		checkRecordLimit();
	}, [time]);

	const getItemsBought = async () => {
		console.log('getItemsBought');

		const token = await IALocalStorage.getTokenUserInfo();
		const userInfoId = await IALocalStorage.getUserInfo();
		setIsLoading(true);
		AxiosFetcher({
			method: 'GET',
			data: undefined,
			url: `/api/person/${userInfoId?.id}/itemsuser`,
			hasToken: true,
			token: token
		})
			.then(async val => {
				// console.log(LogManager.parseJsonObjectToJsonString(val));
				setIsLoading(false);
				userStore.setItemsBag(val || []);
			})
			.catch(err => {
				setIsLoading(false);
				ToastHelper.showError(t('error.common'));
			});
	};

	const checkRecordLimit = () => {
		if (time >= Constant.FLY_MESSAGE.LIMIT_RECORD) {
			stop();
		}
	};

	const checkPermission = async () => {
		let p = await Permissions.check(Platform.OS === 'android' ? Permissions.PERMISSIONS.ANDROID.RECORD_AUDIO : Permissions.PERMISSIONS.IOS.MICROPHONE);
		if (p === Permissions.RESULTS.GRANTED)
			return true;
		else if (p === Permissions.RESULTS.BLOCKED) {
			onClose();
			ToastHelper.showError(t('setting.permission.record'));
			return false;
		}
		return await requestPermission();
	};

	const requestPermission = async () => {
		const p = await Permissions.request(Platform.OS === 'android' ? Permissions.PERMISSIONS.ANDROID.RECORD_AUDIO : Permissions.PERMISSIONS.IOS.MICROPHONE);
		if (p === Permissions.RESULTS.GRANTED) {
			return true;
		}
		return false;
	};

	const start = async () => {
		let permisstion = await checkPermission();
		if (!permisstion) {
			return;
		}
		console.log('start record');
		let interval = setInterval(() => {
			setTime(time => time + 1);
		}, 1000);
		setTimeInterval(interval);
		setAudioFile('');
		setRecording(true);
		AudioRecord.start();
	};



	const stop = async () => {
		if (!recording) return;
		const audioFile = await AudioRecord.stop();
		console.log('audioFile', audioFile);
		setIsLoading(true);
		setAudioFile(audioFile);
		setRecording(false);
		clearInterval(timeInterval);
		Promise.resolve(uploadFileToFireBase({
			uri: audioFile,
			path: audioFile
		}, userStore.userKey, '.wav')).then(async (val) => {
			setIsLoading(false);
			console.log('val', val);
			setTime(0);
			onRecord(val, audioFile);
		}).catch(error => {
			// console.log(error.message);
			ToastHelper.showError(t('error.common'));
		});

	};
	let stringTitle, subTitle;
	switch (title) {
	case 'GIFT':
		stringTitle = 'Gifts';
		subTitle = 'Select one feature items to send';
		break;
	case 'FLY_ITEMS':
		stringTitle = 'Ffy Items';
		subTitle = 'Select one special items to send';
		break;
	case 'VOICE':
		stringTitle = 'Voice';
		subTitle = 'Record your audio';
		break;
	default:
		stringTitle = '';
		subTitle = '';
	}

	return useObserver(() => (
		<Modal isVisible={isVisible} animationIn="fadeIn" animationInTiming={800}
			animationOutTiming={1000}>
			<View style={[styles.container, containerStyle.shadow, style]}>
				<TouchableOpacity onPress={onPress}>
					<AntDesign name="close" size={25} color={colors.black} />
				</TouchableOpacity>
				<View style={[containerStyle.centerNotFlex, {width: '90%'}]}>
					<TextNormal text={stringTitle}
						style={[containerStyle.textHeader, containerStyle.textCenter, containerStyle.largeTextMargin, containerStyle.textDefault]} />
					<Text>{subTitle}</Text>
				</View>
				{
					title === 'VOICE' ?
						<View style={{justifyContent: 'center', alignItems: 'center', alignSelf: 'center'}}>
							<View style={{paddingTop: ScreenHeight * 0.05, paddingBottom: ScreenHeight * 0.05}}>
								<Text
									style={{fontSize: FONTSIZES.xLarge, fontWeight: 'bold'}}> {`${moment.utc(time * 1000).format('mm:ss')}`} </Text>
							</View>

							{!recording ?
								<TouchableOpacity>
									<GradientButton text={'RECORD'}
										onPress={() => {
											start();
										}}
										style={[containerStyle.buttonHalf, containerStyle.buttonCenter, {
											borderRadius: 30,
											height: 40,
											width: ScreenWidth * 0.7,
										}]} />
								</TouchableOpacity> :
								<TouchableOpacity>
									<GradientButton text={'STOP'}
										fromColor={'red'}
										toColor={'red'}
										onPress={() => {
											stop();
										}}
										style={[containerStyle.buttonHalf, containerStyle.buttonCenter, {
											borderRadius: 30,
											height: 40,
											width: ScreenWidth * 0.7
										}]} />
								</TouchableOpacity>
							}
						</View> :
						<>
							{
								isLoading ? <Loading /> :
									userStore && userStore?.itemsBag?.filter(item => item?.quantity > 0)?.slice().length === 0 ?
										<Empty /> :
										<ScrollView style={{maxHeight: ScreenHeight / 2}}> 
											{userStore && userStore?.itemsBag?.filter(item => item?.quantity > 0)?.slice().map(
											(item, index) => {
												return (
													<View
														key={index}
														style={[styles.item]}
													>
														<View
															style={[containerStyle.horContainer, {
																paddingTop: 10,
																paddingBottom: 10,
																alignSelf: 'flex-start',
																justifyContent: 'center',
																alignItems: 'center'
															}]}>
															<ImageAvtRectRounded
																style={[containerStyle.avatarRectRoundedDefault, {
																	borderRadius: ScreenWidth * 0.11,
																	width: ScreenWidth * 0.11,
																	height: ScreenWidth * 0.11,
																}]}
																uri={item.itemUrl || Constant.MOCKING_DATA.PLACE_HOLDER} />
															<Text style={{marginLeft: 10}}> {`${item?.name || ''} (${item?.quantity || 1})`}</Text>
														</View>
														<TouchableOpacity>
															<GradientButton text={'Use'}
																onPress={() => {
																	onUse(item);
																}}
																style={[containerStyle.buttonHalf, containerStyle.buttonCenter, {
																	borderRadius: 30,
																	height: 30,
																	width: ScreenWidth * 0.15
																}]} />
														</TouchableOpacity>
													</View>
												);
											})}
										</ScrollView>
							}
						</>
				}

			</View>
		</Modal>
	));
};


export default ModalItem;

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