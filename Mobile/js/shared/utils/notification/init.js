/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
import { firebase } from '@react-native-firebase/messaging';
import LogManager from '../logging/LogManager';
import { Platform } from 'react-native';
import IALocalStorage from '../storage/IALocalStorage';
import PushNotification from 'react-native-push-notification';
import { Notifications, NotificationAction, NotificationCategory } from 'react-native-notifications';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import notifee from '@notifee/react-native';
import RNVoipCall, { RNVoipPushKit } from 'react-native-voip-call';

let notificationId = '';
export const notificationInitialize = async (store, currentScreen) => {
	checkPermission();
	registerNotificationInBackground();
	registerWatchingNotificationOpened();
	registerHearingNotification(store, currentScreen);
};

// Request permission
export const requestPermission = async () => {
	try {
		await firebase.messaging().requestPermission();
	} catch (error) {
		console.log('Err while trying to request permission: ' + error.message || '');
	}
};
const iosPushKit = () => {
	if (Platform.OS === 'ios') {
		//For Push Kit
		RNVoipPushKit.requestPermissions();  // --- optional, you can use another library to request permissions

		//Ios PushKit device token Listner
		RNVoipPushKit.getPushKitDeviceToken((res) => {
			if (res.platform === 'ios') {
				// setPushkitToken(res.deviceToken)
			}
		});

		//On Remote Push notification Recived in Forground
		RNVoipPushKit.RemotePushKitNotificationReceived((notification) => {
			log(notification);
		});
	}
}

// Register token
export const registerToken = async () => {
	const fcmToken = await firebase.messaging().getToken();
	if (fcmToken) {
		console.log('Token FCM: ' + fcmToken);
	}
};

// Check permission
export const checkPermission = async () => {
	const enabled = await firebase.messaging().hasPermission();
	if (enabled && enabled) {
		await registerToken();
	} else {
		await requestPermission();
	}
	iosPushKit();
	let options = {
		appName: 'Real Estate', // Required
		includesCallsInRecents: false, // boolean (optional) If provided, calls will be shown in the recent calls 
		supportsVideo: true //boolean (optional) If provided, whether or not the application supports video calling (Default: true)
	}
	// Initlize Call Kit IOS is Required
	RNVoipCall.initializeCall(options).then(() => {
		//Success Call Back
	}).catch(e => console.log(e));
};

const displayIncoming = async (message) => {
	if (message?.notification?.body?.includes('video call')) {
		let callOptions = {
			callerId: '825f4094-a674-4765-96a7-1ac512c02a71', // Important uuid must in this format
			ios: {
				phoneNumber: '12344', // Caller Mobile Number
				name: 'Real Estate Video Calling', // caller Name
				hasVideo: true
			},
			android: {
				ringtuneSound: true, // defualt true
				ringtune: 'ringtune', // add file inside Project_folder/android/app/res/raw
				duration: 20000, // defualt 30000
				vibration: true, // defualt is true
				channel_name: 'call1asd', // 
				notificationId: 1121,
				notificationTitle: 'Incomming Call',
				notificationBody: 'Some One is Calling...',
				answerActionTitle: 'Answer',
				declineActionTitle: 'Decline',
			}
		}

		RNVoipCall.displayIncomingCall(callOptions).then((data) => {
			console.log(data)
		}).catch(e => console.log(e))
	}
}

const registerNotificationInBackground = () => {
	firebase.messaging().setBackgroundMessageHandler(async remoteMessage => {
		onDisplayNotification(remoteMessage);
		displayIncoming(remoteMessage);
	});

};

// I will handle the navigation if no token valid.
const registerWatchingNotificationOpened = () => {
	var notificationOpenedListener = firebase.messaging().onNotificationOpenedApp(async (notificationOpen) => {
		// Get information about the notification that was opened
		console.log('notificationOpenedListener: ' + LogManager.parseJsonObjectToJsonString(notificationOpen));
		if (notificationOpen.notification) {
		}
	});
};
const onDisplayNotification = async (notification) => {
	if (notificationId != notification?.from) {
		notificationId = notification?.from;
	} else {
		return;
	}
	console.log(JSON.stringify(notification));
	// Create a channel
	const channelId = await notifee.createChannel({
		id: 'default',
		name: 'StayAlone Channel',
	});

	// Display a notification
	await notifee.displayNotification({
		title: notification?.data?.notification?.title || notification?.notification?.title || notification?.title || 'StayAlone',
		body: notification?.data?.notification?.body || notification?.notification?.body || notification?.body || 'New notification, check it out!',
		android: {
			channelId,
		},
	});
};

const registerHearingNotification = async (store, currentScreen) => {

	var notificationListener = await firebase.messaging().onMessage(async (notification) => {
		console.log('registerHearingNotification: ' + LogManager.parseJsonObjectToJsonString(notification));
		onDisplayNotification(notification);
		displayIncoming(notification);
	});
	firebase.messaging().setBackgroundMessageHandler(async remoteMessage => {
		console.log('registerHearingNotification Background: ' + LogManager.parseJsonObjectToJsonString(remoteMessage));
		onDisplayNotification(remoteMessage);
		displayIncoming(remoteMessage);
	});

	// Handle notification in background - automatically
	firebase.messaging().onMessage((message) => {
		onDisplayNotification(message);
		displayIncoming(message);
		backgroundNotificationHandler(message)
			.then();
	});
};

export const backgroundNotificationHandler = async (message) => {
	onDisplayNotification(message);
	displayIncoming();
	return Promise.resolve(message);
};

/**
 * Set badge notifications
 * @param {number} badge set number of badge
 */
export const setBadge = async (badge) => {
	// await notifications.setBadge(Number(badge));
};

/**
 * Reset badge notifications
 * @param {number} badge set number of badge
 */
export async function resetBadge() {
	// await notifications.setBadge(Number(0));
}