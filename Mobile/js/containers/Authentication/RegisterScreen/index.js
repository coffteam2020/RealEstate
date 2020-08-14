import React, {useEffect, useState} from 'react';
import {StatusBar, View, SafeAreaView, TouchableOpacity, Keyboard} from 'react-native';
import {styles} from './style';
import {withTheme} from 'react-native-paper';
import TextNormal from '../../../shared/components/Text/TextNormal';
import {containerStyle} from '../../../themes/styles';
import {useTranslation} from 'react-i18next';
import {textStyleDefaultHeader} from '../../../themes/text';
import TextInputFlat from '../../../shared/components/TextInput/TextInputFlat';
import {colors} from '../../../shared/utils/colors/colors';``
import GradientButton from '../../../shared/components/Buttons/GradientButton';
import Validator from '../../../shared/utils/validator/Validator';
import {ToastHelper} from '../../../shared/components/ToastHelper';
import Loading from '../../../shared/components/Loading';
import Eye from '../../../shared/components/Icons/Eye';
import {NavigationService} from '../../../navigation';
import {GoogleSignin} from '@react-native-community/google-signin';
import {ScreenNames} from '../../../route/ScreenNames';
import {firebase} from '@react-native-firebase/auth';
import TextPhoneInput from '../../../shared/components/TextInput/TextPhoneInput';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Constant from '../../../shared/utils/constant/Constant';
import {useStores} from '../../../store/useStore';
import {ImageBackground} from 'react-native';
import {images} from '../../../../assets';
import AxiosFetcher from '../../../api/AxiosFetch';
import * as Animatable from 'react-native-animatable';
import CheckBox from '@react-native-community/checkbox';

const RegisterScreen = (props) => {
	const {colorsApp} = props.theme;
	const {t} = useTranslation();
	const [phone, setPhone] = useState('');
	const [showPassword, setShowPassword] = useState(true);
	const [password, setPassword] = useState('');
	const [confirmPass, setConfirmPass] = useState('');
	const [showConfirmPassword, setShowConfirmPassword] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [email, setEmail] = useState('');
	const [isAccept, setIsAccept] = useState(false);
	
	const onPhoneChange = text => {
		setPhone(text);
	};
	const onPassChange = text => {
		setPassword(text);
	};

	const showErrToast = () => {
		setIsLoading(false);
		ToastHelper.showError(t('error.empty'));
	};
	const processSignUp = async () => {
		setIsLoading(true);
		verifyPhone();
	};
	const verifyPhone = () => {
		firebase.auth().signInWithPhoneNumber(phone)
			.then(confirmResult => {
				setIsLoading(false);
				NavigationService.navigate(ScreenNames.OTPVerifyScreen, {phoneNumber: phone, confirmResult: confirmResult, data: {
					password: password,
					phoneNumber: phone.replace(/ /g, ''),
				}});
			})
			.catch(error => {
				setIsLoading(false);
				console.log(error.message);
				ToastHelper.showError(error?.message);
			});
	};
	const onConfirm = async () => {
		Keyboard.dismiss();
		if (Validator.checkEmptyField(phone) || Validator.checkEmptyField(password) || Validator.checkEmptyField(confirmPass)) {
			showErrToast();
		} else if (password != confirmPass) {
			ToastHelper.showError(t('reset.notMatch'));
		} else {
			processSignUp();
		}
	};
	useEffect(() => {
		// GoogleSignin.configure({
		// 	webClientId: Constant.WEB_CLIENT_ID
		// });
	}, []);

	return (
		<View style={[containerStyle.center]}>
			<StatusBar barStyle={colorsApp.statusBar} />
			<ImageBackground source={images.bg_main} style={{width: '100%', height: '100%'}}>
				<SafeAreaView>
					<KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
						<Animatable.View animation="bounceIn" style={styles.content}>
							<TextNormal props={props} text={t('signUp.name')} style={[containerStyle.textHeaderWithMargin]} />
						</Animatable.View>
						<View style={styles.fieldContainer}>
							<TextInputFlat value={email} onChangeText={(text) => onEmailChange(text)} props={props}	placeholder={t('login.emailOrPhone')} textInputStyle={styles.fieldEmailPhone} />
							<TextInputFlat v alue={password} onChangeText={(text) => onPassChange(text)} placeholder={t('reset.password')} onPressIco={() => { setShowPassword(!showPassword); }} secureText={showPassword} props={props} hasRightIco ico={<Eye isOff={!showPassword} color={colors.white} />} style={styles.fieldItemTop} textInputStyle={styles.fieldPassword}/>
							<TextInputFlat value={confirmPass} onChangeText={(text) => setConfirmPass(text)} placeholder={t('reset.confirmPassword')} onPressIco={() => { setShowConfirmPassword(!showConfirmPassword); }} secureText={showConfirmPassword} props={props} hasRightIco ico={<Eye isOff={!showConfirmPassword} color={colors.white} />} style={styles.fieldItemTop} textInputStyle={styles.fieldPassword}/>
							<View style={styles.termWrap}>
								<CheckBox disabled={false} value={isAccept} onValueChange={(newValue) => setIsAccept(newValue)}/>
								<TextNormal props={props} text={t('signUp.agreement')} style={styles.signUpMotto}/>
								<TextNormal props={props} text={t('signUp.term')} style={styles.termCondition}/>
							</View>
							<GradientButton onPress={() => onConfirm()} text={t('signUp.name')} style={styles.button} />

						</View>
						<View style={styles.footerContainer}>
							<TouchableOpacity onPress={() => NavigationService.navigate(ScreenNames.LoginScreen)} style={[containerStyle.horContainerNearlyDefaultCenter, containerStyle.defaultMarginTop]}>
								<TextNormal numberOfLines={2} props={props} text={t('register.hadAccount')} style={styles.mottoEmail} />
								<TextNormal numberOfLines={2} props={props} text={t('login.name')} style={[styles.mottoEmail, styles.sigInMotto]} />
							</TouchableOpacity>
						</View>

					</KeyboardAwareScrollView>
					{isLoading ? <Loading /> : null}
				</SafeAreaView>
			</ImageBackground>
		</View>
	);
};

export default withTheme(RegisterScreen);
