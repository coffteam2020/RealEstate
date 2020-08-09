import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
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
		// // Case 1: The user chose his preferred language setting.
		// const preferredLang = await AsyncStorage.getItem('lang');
		// if (preferredLang) {
		//   return cb(preferredLang);
		// }

		// Case 2: return the default language
		return cb('en');
	},
	init: () => { },
	cacheUserLanguage: () => { },
};

i18n
	.use(languageDetector)
	.use(initReactI18next)
	.init({
		fallbackLng: 'en',
		debug: true,
		resources: {
			['en']: {
				translation: translationGetters['en'](),
			},
			['vn']: {
				translation: translationGetters['en'](),
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
