/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
import { firebase } from '@react-native-firebase/messaging';
import LogManager from '../logging/LogManager';
import { AppState, Platform, PermissionsAndroid } from 'react-native';
import IALocalStorage from '../storage/IALocalStorage';
import PushNotification from 'react-native-push-notification';
import { Notifications, NotificationAction, NotificationCategory } from 'react-native-notifications';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import notifee from '@notifee/react-native';
import { NavigationService } from '../../../navigation';
import { DeviceEventEmitter } from 'react-native';
import IncomingCall from 'react-native-incoming-call';
import BackgroundTimer from 'react-native-background-timer';
import { ScreenNames } from '../../../route/ScreenNames';
import RNCallKeep from 'react-native-callkeep';
let notificationId = '';
let uid = '';
var uuid = require('uuid');
var messages = '';
let currentCallId = null;
export const notificationInitialize = async (store, currentScreen) => {
	BackgroundTimer.start();
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
	const options = {
		ios: {
			appName: 'Dapp Premium',
		},
		android: {
			alertTitle: 'Permissions required',
			alertDescription: 'This application needs to access your phone accounts',
			cancelButton: 'Cancel',
			okButton: 'ok',
			imageName: 'phone_account_icon',
			additionalPermissions: [PermissionsAndroid.PERMISSIONS.example]
		}
	};

	RNCallKeep.setup(options).then(accepted => {
		RNCallKeep.setAvailable(true);
	});
	RNCallKeep.setAvailable(true);
	// Add RNCallKeep Events
	RNCallKeep.addEventListener('didReceiveStartCallAction', didReceiveStartCallAction);
	RNCallKeep.addEventListener('answerCall', onAnswerCallAction);
	RNCallKeep.addEventListener('endCall', onEndCallAction);
	RNCallKeep.addEventListener('didDisplayIncomingCall', onIncomingCallDisplayed);
	RNCallKeep.addEventListener('didPerformSetMutedCallAction', onToggleMute);
	RNCallKeep.addEventListener('didToggleHoldCallAction', onToggleHold);
	RNCallKeep.addEventListener('didPerformDTMFAction', onDTMFAction);
	RNCallKeep.addEventListener('didActivateAudioSession', audioSessionActivated);
}
// Use startCall to ask the system to start a call - Initiate an outgoing call from this point
const startCall = ({ handle, localizedCallerName }) => {
	// Your normal start call action
	RNCallKeep.startCall(getCurrentCallId(), handle, localizedCallerName);
};

const reportEndCallWithUUID = (callUUID, reason) => {
	RNCallKeep.reportEndCallWithUUID(callUUID, reason);
}

// Event Listener Callbacks

const didReceiveStartCallAction = (data) => {
	let { handle, callUUID, name } = data;
	// Get this event after the system decides you can start a call
	// You can now start a call from within your app
};

const onAnswerCallAction = (data) => {
	let { callUUID } = data;
	// Called when the user answers an incoming call
	console.log(JSON.stringify(data));
	console.log(JSON.stringify(messages));
	RNCallKeep.endAllCalls();
	NavigationService.navigate(ScreenNames.VideoCall, { url: messages?.[2] });
};

const onEndCallAction = (data) => {
	let { callUUID } = data;
	RNCallKeep.endCall(getCurrentCallId());
	RNCallKeep.endAllCalls();
	currentCallId = null;
};

// Currently iOS only
const onIncomingCallDisplayed = (data) => {
	let { error } = data;
	// You will get this event after RNCallKeep finishes showing incoming call UI
	// You can check if there was an error while displaying
};

const onToggleMute = (data) => {
	let { muted, callUUID } = data;
	// Called when the system or user mutes a call
};

const onToggleHold = (data) => {
	let { hold, callUUID } = data;
	// Called when the system or user holds a call
};

const onDTMFAction = (data) => {
	let { digits, callUUID } = data;
	// Called when the system or user performs a DTMF action
};

const audioSessionActivated = (data) => {
	// you might want to do following things when receiving this event:
	// - Start playing ringback if it is an outgoing call
};

const getCurrentCallId = () => {
	if (!currentCallId) {
		currentCallId = uuid.v4();
	}

	return currentCallId;
};

// Register token
export const registerToken = async () => {
	const fcmToken = await firebase.messaging().getToken();
	if (fcmToken) {
		console.log('Token FCM: ' + fcmToken);
	}
};

// Check permission
export const checkPermission = async () => {
	init();
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
	// RNVoipCall.initializeCall(options).then(() => {
	// 	//Success Call Back
	// }).catch(e => console.log(e));
};

export const displayIncoming = async (message) => {
	if (Platform.OS === 'android') {
		if (message?.notification?.body?.split[1] === 'VIDEO_CALL' || 
		message?.data?.body?.split[1] === 'VIDEO_CALL') {
			// Display incoming call activity.
			IncomingCall.display(
				'callUUIDv4', // Call UUID v4
				'Quocs', // Username
				'https://avatars3.githubusercontent.com/u/16166195', // Avatar URL
				'Incomming Call', // Info text
				20000 // Timeout for end call after 20s
			);
		}

		// Listen to headless action events
		DeviceEventEmitter.addListener("endCall", payload => {
			// End call action here
		});
		DeviceEventEmitter.addListener("answerCall", (payload) => {
			console.log('answerCall', payload);
			if (payload.isHeadless) {
				// Called from killed state
				IncomingCall.openAppFromHeadlessMode(payload.uuid);
			} else {
				// Called from background state
				IncomingCall.backToForeground();
			}
		});
	}
	// RNCallKeep.backToForeground();
	console.log("displayIncoming" + JSON.stringify(message));
	messages = message;
	console.log(message?.[1]?.includes('VIDEO_CALL'));
	if (message?.[1]?.includes('VIDEO_CALL')) {
		let callOptions = {
			callerId: '825f4094-a674-4765-96a7-1ac512c02a71', // Important uuid must in this format
			ios: {
				phoneNumber: '', // Caller Mobile Number
				name: message?.[0] || `${'Your friend'} is calling you`, // caller Name
				hasVideo: true
			},
			android: {
				ringtuneSound: false, // defualt true
				ringtune: 'ringtune', // add file inside Project_folder/android/app/res/raw
				duration: 20000, // defualt 30000
				vibration: true, // defualt is true
				channel_name: 'real_estate', // 
				notificationId: 1121,
				notificationTitle: 'Incomming Real Estate Call',
				notificationBody: message?.[0] || `${'Your friend'} is calling you`, // caller Name
				answerActionTitle: 'Answer',
				declineActionTitle: 'Decline',
			}
		}
		// RNCallKeep.checkIfBusy().then(val => {
		// 	if (!val) {
		RNCallKeep.displayIncomingCall(getCurrentCallId(), 'Dapp Premium', 'You have a video call from your friend', 'number', true);
		// 	} 
		// })

	} else {
		// RNCallKeep.displayIncomingCall(getCurrentCallId(), 'Dapp Premium', JSON.stringify(message), 'number', true);
	}
}
const init = () => {
	PushNotification.configure({
		// (optional) Called when Token is generated (iOS and Android)
		onRegister: function (token) {
			console.log("TOKEN:", token);

			const deviceToken = token.token;
		},

		// (required) Called when a remote or local notification is opened or received
		onNotification: function (notification) {
			console.log("NOTIFICATION:", notification);

			notification.finish(PushNotificationIOS.FetchResult.NoData);
			// process the notification
			if (notification?.alert?.includes('VIDEO_CALL')) {
				displayIncoming(notification?.alert?.split("#"));
			} else if (notification?.alert?.body?.includes('VIDEO_CALL')) {
				displayIncoming(notification?.alert?.body?.split("#"));
			} else {
				onDisplayNotification(notification?.alert);
			}
			// required on iOS only (see fetchCompletionHandler docs: https://github.com/react-native-community/react-native-push-notification-ios)

		},

		// ANDROID ONLY: GCM or FCM Sender ID (product_number) (optional - not required for local notifications, but is need to receive remote push notifications)
		senderID: "YOUR GCM (OR FCM) SENDER ID",

		// IOS ONLY (optional): default: all - Permissions to register.
		permissions: {
			alert: true,
			badge: true,
			sound: true
		},

		// Should the initial notification be popped automatically
		// default: true
		popInitialNotification: true,

		/**
		 * (optional) default: true
		 * - Specified if permissions (ios) and token (android and ios) will requested or not,
		 * - if not, you must call PushNotificationsHandler.requestPermissions() later
		 */
		requestPermissions: true
	});
}
const registerNotificationInBackground = () => {
	firebase.messaging().setBackgroundMessageHandler(async remoteMessage => {
		console.log("firebase.messaging().setBackgroundMessageHandler" + JSON.stringify(remoteMessage));
		onDisplayNotification(remoteMessage);
		displayIncoming(remoteMessage?.notification?.body?.split("#") || remoteMessage.data?.body?.split("#"));
	});

};

// I will handle the navigation if no token valid.
const registerWatchingNotificationOpened = () => {
	var notificationOpenedListener = firebase.messaging().onNotificationOpenedApp(async (notificationOpen) => {
		// Get information about the notification that was opened
		console.log('notificationOpenedListener: ' + LogManager.parseJsonObjectToJsonString(notificationOpen));
		if (notificationOpen?.notification) {
			var body = notificationOpen?.notification?.body?.split("#") || [];
			displayIncoming(body)
		}
	});
};
const onDisplayNotification = async (notification) => {
	if (notification?.from) {
		if (notificationId != notification?.from) {
			notificationId = notification?.from;
		} else {
			return;
		}
	} else if (notification?.messageId) {
		if (notificationId != notification?.messageId) {
			notificationId = notification?.messageId;
		} else {
			return;
		}
	} else if (notification?.data?.notificationId) {
		if (notificationId != notification?.data?.notificationId) {
			notificationId = notification?.data?.notificationId;
		} else {
			return;
		}
	}

	// console.log(JSON.stringify(notification));
	// Create a channel
	const channelId = await notifee.createChannel({
		id: 'default',
		name: 'Real Estate Channel',
	});
	try {
		const body = notification?.notification?.body;
		// console.log("body" + JSON.stringify(body));
		console.log(body);
		var a = body?.split('#') || [];
		console.log(a);
		if (a[1]) {
			if (a?.[1].includes('MESSAGE')) {
				// Display a notification
				await notifee.displayNotification({
					title: 'Real Estate 🎗',
					body: a?.[0] || 'You have a new chat message, check it out!',
					android: {
						channelId,
					},
				});
			} else if (a?.[1].includes('VIDEO_CALL')) {
				await notifee.displayNotification({
					title: 'Real Estate',
					body: a?.[0] || 'You have a new video call, check it out!',
					android: {
						channelId,
					},
				});
				displayIncoming(a);
			}
		}
	} catch (err) {

	}
};

const registerHearingNotification = async (store, currentScreen) => {

	var notificationListener = await firebase.messaging().onMessage(async (notification) => {
		// RNCallKeep.backToForeground();
		console.log('registerHearingNotification: ' + LogManager.parseJsonObjectToJsonString(notification));
		onDisplayNotification(notification);
		displayIncoming(notification?.notification?.body?.split("#"));
	});
	firebase.messaging().setBackgroundMessageHandler(async remoteMessage => {
		// RNCallKeep.backToForeground();
		console.log('registerHearingNotification Background: ' + LogManager.parseJsonObjectToJsonString(remoteMessage));
		onDisplayNotification(remoteMessage);
		displayIncoming(remoteMessage?.notification?.body?.split("#") || remoteMessage?.data?.body?.split("#"));
	});

	// Handle notification in background - automatically
	firebase.messaging().onMessage((message) => {
		// RNCallKeep.backToForeground();
		console.log('messaging().onMessage ' + LogManager.parseJsonObjectToJsonString(message));
		onDisplayNotification(message);
		displayIncoming(message?.notification?.body?.split("#") || message?.data?.body?.split("#"));
		backgroundNotificationHandler(message)
			.then();
	});
	firebase.messaging().setBackgroundMessageHandler(async remoteMessage => {
		console.log('Message handled in the background!', remoteMessage);
		onDisplayNotification(remoteMessage);
		displayIncoming(remoteMessage?.notification?.body?.split("#") || remoteMessage?.data?.body?.split("#"));
		if (Platform.OS === 'android') {
			if (remoteMessage?.notification?.body?.split[1] === 'VIDEO_CALL' || 
			remoteMessage?.data?.body?.split[1] === 'VIDEO_CALL') {
				// Display incoming call activity.
				IncomingCall.display(
					'callUUIDv4', // Call UUID v4
					'Quocs', // Username
					'https://avatars3.githubusercontent.com/u/16166195', // Avatar URL
					'Incomming Call', // Info text
					20000 // Timeout for end call after 20s
				);
			}

			// Listen to headless action events
			DeviceEventEmitter.addListener("endCall", payload => {
				// End call action here
			});
			DeviceEventEmitter.addListener("answerCall", (payload) => {
				console.log('answerCall', payload);
				if (payload.isHeadless) {
					// Called from killed state
					IncomingCall.openAppFromHeadlessMode(payload.uuid);
				} else {
					// Called from background state
					IncomingCall.backToForeground();
				}
			});
		}
	});
};

export const backgroundNotificationHandler = async (message) => {
	console.log('backgroundNotificationHandler ' + LogManager.parseJsonObjectToJsonString(message));
	onDisplayNotification(message);
	// RNCallKeep.backToForeground();
	displayIncoming(message?.notification?.body?.split("#") || message?.notification?.title?.split("#") || message?.data?.body?.split("#"));
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