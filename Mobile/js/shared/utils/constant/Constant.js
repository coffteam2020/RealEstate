import { Platform } from "react-native";

export default {
	/**
   * Define staging and production URL
   */
	URL: {
		urls: {
			staging: 'http://103.28.38.142:8888/',
			production: 'http://103.28.38.142:8888/'
		},
		api: {
			login: 'auth/login',
			register: 'auth/register',
		}
	},
	PLATFORMS: {
		ANDROID: 'android',
		IOS: 'ios'
	},
	/**
   * Define methods for request apis
   */
	METHOD: {
		post: 'POST',
		put: 'PUT',
		get: 'GET',
		patch: 'PATCH',
		delete: 'DELETE'
	},
	LOGIN_TYPE: {
		facebook: 'facebook',
		google: 'google',
		original: 'original'
	},
	/**
   * Set timeout request
   */
	TIME_OUT_REQUEST: 100000,

	/**
   * Constant for key/value in storage manager
   */
	USER: {
		USER_INFO: 'USER_INFO',
		USER_DETAIL_INFO: 'USER_DETAIL_INFO',
		USER_DELETE: 'USER_DELETE',
		TOKEN_INFO: 'TOKEN_INFO',
		TOKEN_FIRST_TIME: 'TOKEN_FIRST_TIME',
		DEVICE_TOKEN: 'DEVICE_TOKEN',
		SEARCH: 'SEARCH',
		GENDER: {
			MALE: 'M',
			FEMALE: 'F'
		}
	},
	NOTIFICATION: {
		VIBRATE_TIME: 500,
	},

	/**
   * Constant for mocking data
   */
	MOCKING_DATA: {
		USER: {
			USERNAME: 'Admin@gmail.com',
			PASSWORD: 'admin'
		},
		PLACE_HOLDER: 'https://media.istockphoto.com/vectors/people-icon-vector-male-person-symbol-profile-circle-avatar-sign-in-vector-id959085942?k=6&m=959085942&s=170667a&w=0&h=f3Q3lGKve2kDDzr0DnscSQMZ01Dy19r6zbWIP9zuXRk=',
		NO_IMG_PLACE_HOLDER: 'https://www.kvplus.ch/directus/thumbnail/100/100/contain/8%D0%A106.29_3.jpg',
		ANY_AVATAR: 'https://media.istockphoto.com/vectors/people-icon-vector-male-person-symbol-profile-circle-avatar-sign-in-vector-id959085942?k=6&m=959085942&s=170667a&w=0&h=f3Q3lGKve2kDDzr0DnscSQMZ01Dy19r6zbWIP9zuXRk='
	},
	FIREBASE: {
		apiKey: 'AIzaSyCz-TD1jngI_t6N_cvXlS43pWC_lMOUvsQ',
		authDomain: 'stayalone-prod.firebaseio.com',
		databaseURL: 'https://stayalone-prod.firebaseio.com',
		projectId: 'stayalone-prod',
		messagingSenderId: '1009498688082',
		storageBucket: ''
	},
	FIREBASE_SPECIFIC: {
		appIdAndroid: '1:1009498688082:android:5c0578920909fa5ad30a59',
		appIdiOS: '1:1009498688082:ios:d43ebc7b01fec214d30a59'
	},
	SCHEMA: {
		USER: 'Users',
		TASK: 'Tasks',
		NOTIFICATION: 'Notifications',
		QUESTION: 'Questions',
		ATTACHMENTS: 'Attachments',
		CARE_TEAM: 'CareTeam',
		DOCTOR: 'Doctors',
		MESSAGES: 'Messages',
		LIVESTREAM: 'Livestream',
		AUDIO: 'Audio',
		MESSAGESFLOATING: 'Floating',
	},
	SECRET_ROOM: 'AIzaSyByxV0mwTmpcf',
	PAYMENT_ACCOUNT: {
		STANDARD: 'STANDARD',
		GOLD: 'GOLD',
		PREMIUM: 'PREMIUM',
	},
	FOR_TYPE_ADD_QUESTION: {
		YOU: 'YOU',
		ANOTHER: 'ANOTHER',
		SPECIFIED: 'SPECIFIED'
	},
	SECRET: {
		CYPER: 'DOCTIFYYYY'
	},
	WEB_CLIENT_ID:
		Platform.OS === 'ios' ? '1009498688082-pvid5ablpbptusuoom7avvcjeku3o5u7.apps.googleusercontent.com': '1009498688082-n5gsvugfto799qt8j222291ochbqfaml.apps.googleusercontent.com',
	LOCATION_BACKGROUND_BTN: [0, 0.36, 1],
	COLOR_BACKGROUND_BTN: ['#665AAA', '#665AAA'],
	PROGRESS: ['#15B7B0', '#34EE99'],
	GRADIENT_BACKGROUND_BTN: ['#00B6B6', '#00CCCC', '#00E3E1'],
	SPLASH_TIME_OUT: 500,
	CONTENT_TIME_OUT: 3000,
	BUTTON_TIME_OUT: 2000,
	DEFAULT_TIME: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
	NOTIFICATION_TYPES: {
		'MESSAGE': 'MESSAGE',
		'MISSCALL': 'MISSCALL',
		'APPOINTMENT': 'APPOINTMENT',
		'CARD': 'CARD',
		'PROFILE': 'PROFILE',
		'GOTCALL': 'GOTCALL'
	},
	TASK_TYPES: {
		'TEETH': 'TEETH',
		'VACCINE': 'VACCINE',
		'MEDICINE': 'MEDICINE'
	},
	MEDICALS_TAG: [
		'Emergency_resuscitation_and_poison_control',
		'Medical',
		'Pediatrics',
		'Tuberculosis_(surgical)',
		'Dermatology',
		'Mental',
		'Endocrine',
		'Traditional_medicine',
		'Tumor',
		'Surgery',
		'Ear_nose_and_throat',
		'Dentomaxillofacial',
		'Plastic_surgery',
		'Optical_power',
		'Nuclear_medicine',
		'Biochemistry',
		'Endoscopic_diagnostic_intervention',
		'Burn',
		'Eye',
		'Endoscopic_surgery',
		'Hematology_-_Blood transfusion',
		'Pathological_and_cytological_anatomy',
		'Microsurgery',
		'Microbiology_-_Parasites',
		'Rehabilitation'
	],
	/**
   * Define LIMIT of recording 
   */

	FLY_MESSAGE: {
	   LIMIT_RECORD : 10 // seconds
	},
	COUNTRIES: [
		{
			'name': 'Albanian',
			'key': 'sq'
		},
		{
			'name': 'Amharic',
			'key': 'am'
		},
		{
			'name': 'Arabic',
			'key': 'ar'
		},
		{
			'name': 'Armenian',
			'key': 'hy'
		},
		{
			'name': 'Azerbaijani',
			'key': 'az'
		},
		{
			'name': 'Basque',
			'key': 'eu'
		},
		{
			'name': 'Belarusian',
			'key': 'be'
		},
		{
			'name': 'Bengali',
			'key': 'bn'
		},
		{
			'name': 'Bosnian',
			'key': 'bs'
		},
		{
			'name': 'Bulgarian',
			'key': 'bg'
		},
		{
			'name': 'Catalan',
			'key': 'ca'
		},
		{
			'name': 'Cebuano',
			'key': 'ceb'
		},
		{
			'name': 'Chinese (Simplified)',
			'key': 'zh-CN'
		},
		{
			'name': 'Chinese (Traditional)',
			'key': 'zh-TW'
		},
		{
			'name': 'Corsican',
			'key': 'co'
		},
		{
			'name': 'Croatian',
			'key': 'hr'
		},
		{
			'name': 'Czech',
			'key': 'cs'
		},
		{
			'name': 'Danish',
			'key': 'da'
		},
		{
			'name': 'Dutch',
			'key': 'nl'
		},
		{
			'name': 'English',
			'key': 'en'
		},
		{
			'name': 'Esperanto',
			'key': 'eo'
		},
		{
			'name': 'Estonian',
			'key': 'et'
		},
		{
			'name': 'Finnish',
			'key': 'fi'
		},
		{
			'name': 'French',
			'key': 'fr'
		},
		{
			'name': 'Frisian',
			'key': 'fy'
		},
		{
			'name': 'Galician',
			'key': 'gl'
		},
		{
			'name': 'Georgian',
			'key': 'ka'
		},
		{
			'name': 'German',
			'key': 'de'
		},
		{
			'name': 'Greek',
			'key': 'el'
		},
		{
			'name': 'Gujarati',
			'key': 'gu'
		},
		{
			'name': 'Haitian Creole',
			'key': 'ht'
		},
		{
			'name': 'Hausa',
			'key': 'ha'
		},
		{
			'name': 'Hawaiian',
			'key': 'haw'
		},
		{
			'name': 'Hebrew',
			'key': 'he'
		},
		{
			'name': 'Hindi',
			'key': 'hi'
		},
		{
			'name': 'Hmong',
			'key': 'hmn'
		},
		{
			'name': 'Hungarian',
			'key': 'hu'
		},
		{
			'name': 'Icelandic',
			'key': 'is'
		},
		{
			'name': 'Igbo',
			'key': 'ig'
		},
		{
			'name': 'Indonesian',
			'key': 'id'
		},
		{
			'name': 'Irish',
			'key': 'ga'
		},
		{
			'name': 'Italian',
			'key': 'it'
		},
		{
			'name': 'Japanese',
			'key': 'ja'
		},
		{
			'name': 'Javanese',
			'key': 'jv'
		},
		{
			'name': 'Kannada',
			'key': 'kn'
		},
		{
			'name': 'Kazakh',
			'key': 'kk'
		},
		{
			'name': 'Khmer',
			'key': 'km'
		},
		{
			'name': 'Kinyarwanda',
			'key': 'rw'
		},
		{
			'name': 'Korean',
			'key': 'ko'
		},
		{
			'name': 'Kurdish',
			'key': 'ku'
		},
		{
			'name': 'Kyrgyz',
			'key': 'ky'
		},
		{
			'name': 'Lao',
			'key': 'lo'
		},
		{
			'name': 'Latin',
			'key': 'la'
		},
		{
			'name': 'Latvian',
			'key': 'lv'
		},
		{
			'name': 'Lithuanian',
			'key': 'lt'
		},
		{
			'name': 'Luxembourgish',
			'key': 'lb'
		},
		{
			'name': 'Macedonian',
			'key': 'mk'
		},
		{
			'name': 'Malagasy',
			'key': 'mg'
		},
		{
			'name': 'Malay',
			'key': 'ms'
		},
		{
			'name': 'Malayalam',
			'key': 'ml'
		},
		{
			'name': 'Maltese',
			'key': 'mt'
		},
		{
			'name': 'Maori',
			'key': 'mi'
		},
		{
			'name': 'Marathi',
			'key': 'mr'
		},
		{
			'name': 'Mongolian',
			'key': 'mn'
		},
		{
			'name': 'Myanmar (Burmese)',
			'key': 'my'
		},
		{
			'name': 'Nepali',
			'key': 'ne'
		},
		{
			'name': 'Norwegian',
			'key': 'no'
		},
		{
			'name': 'Nyanja (Chichewa)',
			'key': 'ny'
		},
		{
			'name': 'Odia (Oriya)',
			'key': 'or'
		},
		{
			'name': 'Pashto',
			'key': 'ps'
		},
		{
			'name': 'Persian',
			'key': 'fa'
		},
		{
			'name': 'Polish',
			'key': 'pl'
		},
		{
			'name': 'Portuguese (Portugal, Brazil)',
			'key': 'pt'
		},
		{
			'name': 'Punjabi',
			'key': 'pa'
		},
		{
			'name': 'Romanian',
			'key': 'ro'
		},
		{
			'name': 'Russian',
			'key': 'ru'
		},
		{
			'name': 'Samoan',
			'key': 'sm'
		},
		{
			'name': 'Scots Gaelic',
			'key': 'gd'
		},
		{
			'name': 'Serbian',
			'key': 'sr'
		},
		{
			'name': 'Sesotho',
			'key': 'st'
		},
		{
			'name': 'Shona',
			'key': 'sn'
		},
		{
			'name': 'Sindhi',
			'key': 'sd'
		},
		{
			'name': 'Sinhala (Sinhalese)',
			'key': 'si'
		},
		{
			'name': 'Slovak',
			'key': 'sk'
		},
		{
			'name': 'Slovenian',
			'key': 'sl'
		},
		{
			'name': 'Somali',
			'key': 'so'
		},
		{
			'name': 'Spanish',
			'key': 'es'
		},
		{
			'name': 'Sundanese',
			'key': 'su'
		},
		{
			'name': 'Swahili',
			'key': 'sw'
		},
		{
			'name': 'Swedish',
			'key': 'sv'
		},
		{
			'name': 'Tagalog (Filipino)',
			'key': 'tl'
		},
		{
			'name': 'Tajik',
			'key': 'tg'
		},
		{
			'name': 'Tamil',
			'key': 'ta'
		},
		{
			'name': 'Tatar',
			'key': 'tt'
		},
		{
			'name': 'Telugu',
			'key': 'te'
		},
		{
			'name': 'Thai',
			'key': 'th'
		},
		{
			'name': 'Turkish',
			'key': 'tr'
		},
		{
			'name': 'Turkmen',
			'key': 'tk'
		},
		{
			'name': 'Ukrainian',
			'key': 'uk'
		},
		{
			'name': 'Urdu',
			'key': 'ur'
		},
		{
			'name': 'Uyghur',
			'key': 'ug'
		},
		{
			'name': 'Uzbek',
			'key': 'uz'
		},
		{
			'name': 'Vietnamese',
			'key': 'vi'
		},
		{
			'name': 'Welsh',
			'key': 'cy'
		},
		{
			'name': 'Xhosa',
			'key': 'xh'
		},
		{
			'name': 'Yiddish',
			'key': 'yi'
		},
		{
			'name': 'Yoruba',
			'key': 'yo'
		}
	],
	ITEMS:  [{'title':'BEAR','name':'BEAR','description':null,'type':'BEAR','itemCode':'1594059554386','quantity':5,'createdOn':null,'itemUrl':'https://storage.googleapis.com/stayalone-prod/images/MdZWlAvakBcXntK','salable':true},{'title':'camera','name':'camera','description':null,'type':'CAMERA','itemCode':'1594060203917','quantity':6,'createdOn':null,'itemUrl':'https://storage.googleapis.com/stayalone-prod/images/SrJaXbifqwafzlI','salable':false},{'title':'RINGS','name':'RINGS','description':null,'type':'RING','itemCode':'1594059715279','quantity':3,'createdOn':null,'itemUrl':'https://storage.googleapis.com/stayalone-prod/images/zoTlsQzvcdMsdSl','salable':true},{'title':'Diamond','name':'Diamond','description':null,'type':'DIAMOND','itemCode':'1594059734606','quantity':2,'createdOn':null,'itemUrl':'https://storage.googleapis.com/stayalone-prod/images/rAtjzkkKukkNxht','salable':true},{'title':'PETS','name':'PETS','description':null,'type':'PETS','itemCode':'1594059762163','quantity':0,'createdOn':null,'itemUrl':'https://storage.googleapis.com/stayalone-prod/images/jgkelurPAIuGqeC','salable':true},{'title':'car','name':'car','description':null,'type':'CAR','itemCode':'1594059629607','quantity':6,'createdOn':null,'itemUrl':'https://storage.googleapis.com/stayalone-prod/images/fOiNquhfCsnkEeL','salable':true}]

};
