import React, {useEffect, useState} from 'react';
import {StatusBar,
	View,
	SafeAreaView,
	TouchableOpacity,
	ImageBackground,
	Platform,} from 'react-native';
import {styles} from './style';
import {images} from '../../../../assets/index';
import {withTheme} from 'react-native-paper';
import TextNormal from '../../../shared/components/Text/TextNormal';
import {containerStyle} from '../../../themes/styles';
import {useTranslation} from 'react-i18next';
import TextInputFlat from '../../../shared/components/TextInput/TextInputFlat';
import Eye from '../../../shared/components/Icons/Eye';
import TrackPlayer from 'react-native-track-player';
import {colors} from '../../../shared/utils/colors/colors';
import GradientButton from '../../../shared/components/Buttons/GradientButton';
import {AccessToken,
	GraphRequest,
	GraphRequestManager,
	LoginManager,} from 'react-native-fbsdk';
import * as Animatable from 'react-native-animatable';
import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';
import Route, {ScreenNames} from '../../../route/ScreenNames';
import IALocalStorage from '../../../shared/utils/storage/IALocalStorage';
import {NavigationService} from '../../../navigation';
import {ToastHelper} from '../../../shared/components/ToastHelper';
import Validator from '../../../shared/utils/validator/Validator';
import Loading from '../../../shared/components/Loading';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LogManager from '../../../shared/utils/logging/LogManager';
import {useStores} from '../../../store/useStore';
import AxiosFetcher from '../../../api/AxiosFetch';
import appleAuth, {AppleButton,
	AppleAuthRequestOperation,
	AppleAuthRequestScope,
	AppleAuthCredentialState,} from '@invertase/react-native-apple-authentication';


const LoginScreen = (props) => {
	const {userStore} = useStores();
	const {colorsApp} = props.theme;
	const {t} = useTranslation();
	const [password, setPassword] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [validEmail, setValidEmail] = useState(false);
	const [notEmptyPass, setNotEmptyPass] = useState(false);
	const [showPass, setShowPass] = useState(true);

	const onLogin = async () => {
		setIsLoading(true);
		if (Validator.checkEmptyField(password)) {
			setIsLoading(false);
			ToastHelper.showError(t('error.empty'));
		} else {
			setIsLoading(true);
			AxiosFetcher({
				method: 'POST',
				url: '/api/auth/login',
				data: {
					phoneNumber: email,
					password: password,
					loginMethod: 'NORMAL',
				}
			}).then(async val => {
				console.log(' LOGIN INFO' + LogManager.parseJsonObjectToJsonString(val));
				setIsLoading(false);
				if (val && val?.accessToken != '' && !val?.message) {
					await IALocalStorage.setTokenUserInfo(val?.accessToken);
					await IALocalStorage.setUserInfo(val);
					userStore.setUserInfo(val);
					NavigationService.navigate(ScreenNames.HomeScreen);
				} else {
					ToastHelper.showError(t('error.auth/user-not-found'));
				}
			})
				.catch(val => {
					setIsLoading(false);
					ToastHelper.showError(t('error.auth/user-not-found'));
				});
		}

	};
	const onAppleButtonPress = async () => {
		// performs login request
		const appleAuthRequestResponse = await appleAuth.performRequest({
			requestedOperation: AppleAuthRequestOperation.LOGIN,
			requestedScopes: [AppleAuthRequestScope.EMAIL, AppleAuthRequestScope.FULL_NAME],
		});

		// get current authentication state for user
		// /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
		const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

		// use credentialState response to ensure the user is authenticated
		if (credentialState === AppleAuthCredentialState.AUTHORIZED) {
			// user is authenticated
			const {user,
				email,
				nonce,
				identityToken,
				realUserStatus /* etc */,} = appleAuthRequestResponse;
			console.log(LogManager.parseJsonObjectToJsonString(appleAuthRequestResponse));
			if (email != null) {
				await IALocalStorage.setDetailUserInfoApple(email);
				if (identityToken) {
					onFireBaseCheckEmail(identityToken, email);
				} else {
					onFireBaseCheckEmail('identityToken', email);
				}
			} else {
				let email = await IALocalStorage.getDetailUserInfoApple();
				if (!email) {
					email = `guest_${new Date().getTime()}@applemail.com`;
					await IALocalStorage.setDetailUserInfoApple(email);
				}
				if (identityToken) {
					onFireBaseCheckEmail(identityToken, email);
				} else {
					onFireBaseCheckEmail('identityToken', email);
				}
			}
		}
	};
	const onFireBaseCheckEmail = async (token, email, socialID) => {
		setIsLoading(true);
		AxiosFetcher({
			method: 'POST',
			url: '/api/auth/login',
			data: {
				'email': email,
				'loginMethod': 'SOCIAL',
				'token': token,
				'socialId': socialID
			}
		})
			.then(async val => {
				setIsLoading(false);
				if (val && val?.accessToken != '') {
					await IALocalStorage.setTokenUserInfo(val?.accessToken);
					await IALocalStorage.setUserInfo(val);
					userStore.setUserInfo(val);
					NavigationService.navigate(ScreenNames.HomeScreen);
				} else {
					ToastHelper.showError(t('error.auth/user-not-found'));
				}
			})
			.catch(val => {
				setIsLoading(false);
				ToastHelper.showError(t('error.auth/user-not-found'));
			});
	};

	const onPasswordChange = (text) => {
		setPassword(text);
		if (Validator.checkEmptyField(password)) {
			setNotEmptyPass(false);
		} else {
			setNotEmptyPass(true);
		}
	};

	const onEmailChange = (text) => {
		setEmail(text);
		if (Validator.checkEmail(email)) {
			setValidEmail(true);
		} else {
			setValidEmail(false);
		}
	};

	useEffect(() => {
		// IALocalStorage.setUserInfo(null);
		// GoogleSignin.configure({
		// 	webClientId: Constant.WEB_CLIENT_ID,
		// });
		// userStore.setUserRegisterBeing({});
	});
	const onPhoneChange = text => {
		setPhone(text);
	};

	return (
		<View style={[containerStyle.default]}>
			<StatusBar barStyle={colorsApp.statusBar}/>
			<ImageBackground source={images.bg_main} style={{width: '100%', height: '100%'}}>
				<SafeAreaView >
					<KeyboardAwareScrollView showsVerticalScrollIndicator={false} >
						<Animatable.View animation="bounceIn" style={styles.content}>
							<TextNormal
								props={props}
								style={[containerStyle.textHeaderWithMargin]}
								text={t('login.name')}
							/>
						</Animatable.View>
						<View style={styles.fieldContainer}>							
							<TextInputFlat
								value={email}
								onChangeText={(text) => onEmailChange(text)}
								props={props}
								placeholder={t('login.emailOrPhone')}
								textInputStyle={styles.fieldEmailPhone}
							/>
							<TextInputFlat
								value={password}
								onChangeText={(text) => onPasswordChange(text)}
								props={props}
								hasRightIco={notEmptyPass}
								secureText={showPass}
								onPressIco={() => {
									if (notEmptyPass) {
										setShowPass(!showPass);
									}
								}}
								placeholder={t('login.password')}
								ico={<Eye color={colors.iconGreen} isOff={!showPass} />}
								textInputStyle={styles.fieldPassword}
							/>
							<TextNormal
								props={props}
								text={t('login.forget')}
								style={styles.fieldForget}
								clickable
								onPress={() =>
									NavigationService.navigate(Route.ScreenNames.ResetScreen)
								}
							/>
							<GradientButton style={styles.signinButton} onPress={() => onLogin()} text={t('login.name')} />
							
						</View>
						<View style={styles.footerContainer}>
							<TouchableOpacity
								onPress={() =>
									NavigationService.navigate(ScreenNames.RegisterScreen)
								}
								style={[containerStyle.horContainer, styles.signUp, containerStyle.defaultMarginTop]}>
								<TextNormal
									props={props}
									text={t('login.dontHaveAccount')}
									style={styles.signUpMotto}
								/>
								<TextNormal
									props={props}
									text={t('signUp.name')}
									style={styles.signUpTitle}
								/>
							</TouchableOpacity>
						</View>
					</KeyboardAwareScrollView>
					{isLoading ? <Loading /> : null}
				</SafeAreaView>
			</ImageBackground>
		</View>
	);
};

export default withTheme(LoginScreen);
