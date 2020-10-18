/* eslint-disable no-unused-vars */
import {firebase} from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import RNVoipCall, { RNVoipPushKit } from 'react-native-voip-call';
import { NavigationService } from '../../../navigation';
import { ScreenNames } from '../../../route/ScreenNames';

const displayIncoming = async (message) => {
	console.log("displayIncoming" + JSON.stringify(message));

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

		RNVoipCall.displayIncomingCall(callOptions).then((data) => {
			console.log("displayIncomingCall" + JSON.stringify(data));
		}).catch(e => console.log(e))
		//app open Automatically when Call recived
		RNVoipCall.onCallOpenAppEvent(event => {
			console.log("onCallOpenAppEvent" + JSON.stringify(event));
		});
		// on click call Notification
		RNVoipCall.onCallNotificationOpen(event => {
			console.log("onCallNotificationOpen" + JSON.stringify(event));
		});
		RNVoipCall.onCallAnswer(data => {
			console.log("onCallAnswer" + JSON.stringify(data));
			RNVoipCall.endCall('825f4094-a674-4765-96a7-1ac512c02a71'); // End specific Call
			RNVoipCall.endAllCalls(); // End All Calls
			NavigationService.navigate(ScreenNames.VideoCall, { url: message?.[2] });
		});
		RNVoipCall.onEndCall(data => {
			RNVoipCall.endCall('825f4094-a674-4765-96a7-1ac512c02a71'); // End specific Call
			RNVoipCall.endAllCalls(); // End All Calls
			console.log(data);
		});
		// missed call notification taped
		RNVoipCall.onMissedCallOpen(event => {
			RNVoipCall.endCall('825f4094-a674-4765-96a7-1ac512c02a71'); // End specific Call
			RNVoipCall.endAllCalls(); // End All Calls
		});
	}
}

export default async (message) => {
	// handle your message
	displayIncoming(message);
	return Promise.resolve();
};