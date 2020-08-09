import {Platform} from 'react-native';

import {firebase} from '@react-native-firebase/storage';
import {FirebaseService} from '../../../api/FirebaseService';
import Constant from '../constant/Constant';
var uuid = require('uuid');
var moment = require('moment');

export const FireBaseStorage = firebase.storage();

export const imagePickerOptions = {
	noData: true,
};

const getFileLocalPath = response => {
	const {path, uri} = response;
	console.log({path, uri});
	return Platform.OS === 'android' ? path : uri;
};

export const createStorageReferenceToFile = (response, fileType) => {
	const {fileName, name} = response;
	return FireBaseStorage.ref(fileName && fileName || name || (uuid.v4() + fileType));
};

export const uploadFileToFireBase = async (response, userKey, fileType = '.png') => {
	try {
		const fileSource = getFileLocalPath(response);
		console.log("fileSource" + fileSource);
		const storageRef = createStorageReferenceToFile(response, fileType);
		console.log("storageRef" + storageRef);
		await storageRef.putFile(fileSource);
		const url = await storageRef.getDownloadURL().catch((error) => { throw error; });
		uploadDocumentLinkToFirebase(url, userKey);

		return url;
	} catch (err) {
		alert(err?.message);
	}
};
const uploadDocumentLinkToFirebase = (url, userKey) => {
	let currentTime = moment().valueOf();
	let id = uuid.v4();
	FirebaseService.pushNewItem(Constant.SCHEMA.ATTACHMENTS, JSON.parse(JSON.stringify({
		url: url,
		createdAt: currentTime,
		userId: userKey,
		id: id
	})));
};