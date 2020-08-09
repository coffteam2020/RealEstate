/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
import {firebase} from '@react-native-firebase/messaging';
import LogManager from '../logging/LogManager';
import {Platform} from 'react-native';
import IALocalStorage from '../storage/IALocalStorage';
import PushNotification from 'react-native-push-notification';
import {Notifications, NotificationAction, NotificationCategory} from 'react-native-notifications';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import notifee from '@notifee/react-native';

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
};

const registerNotificationInBackground = () => {
	firebase.messaging().setBackgroundMessageHandler(async remoteMessage => {
		onDisplayNotification(remoteMessage);
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
	});
	firebase.messaging().setBackgroundMessageHandler(async remoteMessage => {
		console.log('registerHearingNotification Background: ' + LogManager.parseJsonObjectToJsonString(remoteMessage));
		onDisplayNotification(remoteMessage);
	  });

	// Handle notification in background - automatically
	firebase.messaging().onMessage((message) => {
		onDisplayNotification(message);
		backgroundNotificationHandler(message)
			.then();
	});
};

export const backgroundNotificationHandler = async (message) => {
	onDisplayNotification(message);
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