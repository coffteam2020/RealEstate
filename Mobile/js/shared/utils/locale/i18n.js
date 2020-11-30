import i18n from 'i18next';
import I18n, { initReactI18next } from 'react-i18next';
import { NativeModules, Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

const translationGetters = {
	// lazy requires (metro bundler does not support symlinks)
	'en': () => require('./en.json'),
	'vn': () => require('./vn.json')
};

const languageDetector = {
	type: 'languageDetector',
	async: true,
	detect: async cb => {
		// console.log('================' + cb);
		// // Case 1: The user chose his preferred language setting.
		const preferredLang = await AsyncStorage.getItem('lang');
		if (preferredLang) {
			return cb(preferredLang);
		}
		const deviceLanguage =
			Platform.OS === 'ios'
				? NativeModules.SettingsManager.settings.AppleLocale ||
				NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
				: NativeModules.I18nManager.localeIdentifier;
		// alert(deviceLanguage);
		await AsyncStorage.setItem('lang', deviceLanguage?.split('_')?.[0]?.toLowerCase());
		// Case 2: return the default language
		return cb(deviceLanguage?.split('_')?.[0]?.toLowerCase());
	},
	init: () => { },
	cacheUserLanguage: () => { },
};

i18n
	.use(languageDetector)
	.use(initReactI18next)
	.init({
		fallbackLng: 'vn',
		debug: true,
		resources: {
			['en']: {
				translation: translationGetters['en'](),
			},
			['vn']: {
				translation: translationGetters['vn'](),
			},
		},
		react: {
			useSuspense: false,
		},
	});

export const handleChangeLanguage = async (lang, i18next) => {
	await AsyncStorage.setItem('lang', lang);
	i18next.changeLanguage(lang);
};

export default i18n;
