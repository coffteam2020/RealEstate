import {firebase} from '@react-native-firebase/database';

export const FirebaseService = {
	async queryAllItemBySchema(schema) {
		return new Promise(async (resolve, reject) => {
			let result = await firebase.database().ref(schema).once('value');
			if (result.val() != null) {
				resolve(Object.values(result.val()));
			} else {
				resolve([]);
			}
		});
	},
	async queryChildToUpdate(schema, child, objectUpdate) {
		return new Promise(async (resolve, reject) => {
			let result = await firebase.database().ref(schema).child(child).update(objectUpdate);
			resolve(Object.values(result.val()));
		});
	},
	async queryAllItemBySchemaWithSpecifiedChild(schema, orderByChild, equalTo, isUnBound, isGetKey) {
		return new Promise(async (resolve, reject) => {
			let result = await firebase.database().ref(schema)
				.orderByChild(orderByChild)
				.equalTo(equalTo)
				.once('value');
			resolve(isUnBound && isUnBound ? result : (isGetKey && isGetKey ? Object.keys(result.val()) : Object.values(result.val())));
		});
	},
	async queryAllItemBySchemaWithOrderedByChild(schema, orderByChild, isUnBound, isGetKey) {
		return new Promise(async (resolve, reject) => {
			let result = await firebase.database().ref(schema)
				.orderByChild(orderByChild)
				.once('value');
			resolve(isUnBound && isUnBound ? result : (isGetKey && isGetKey ? Object.keys(result.val()) : Object.values(result.val())));
		});
	},
	async pushNewItem(schema, object, isGetKey) {
		return new Promise(async (resolve, reject) => {
			let result = await firebase.database().ref(schema).push(object);
			resolve(isGetKey && isGetKey ? result.key : result);
		});
	},
	async pushNewItemWithChildKey(schema, childKey, object, isGetKey) {
		return new Promise(async (resolve, reject) => {
			let result = await firebase.database().ref(schema).child(childKey).set(object);
			resolve(isGetKey && isGetKey ? result.key : result);
		});
	},
	async updateItem(scheme, child, object) {
		return new Promise(async (resolve, reject) => {
			let result = firebase.database().ref(scheme).child(child).update(object);
			resolve(result);
		});
	}
};
