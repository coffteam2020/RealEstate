/* eslint-disable no-unused-vars */
import {firebase} from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import { NavigationService } from '../../../navigation';
import { ScreenNames } from '../../../route/ScreenNames';
import RNCallKeep from 'react-native-callkeep';
var uuid = require('uuid');

const displayIncoming = async (message) => {
	console.log("displayIncodsadasming=======" + JSON.stringify(message));
	
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
		const a = uuid.v4();
		RNCallKeep.startCall(`${new Date().getTime()}`);
		RNCallKeep.displayIncomingCall(a, 'Dapp Premium', 'You have a video call from your friend','number', true );
	}
}

export default async (message) => {
	// handle your message
	displayIncoming(message?.notification?.body?.split("#") || message?.data);
	return Promise.resolve();
};