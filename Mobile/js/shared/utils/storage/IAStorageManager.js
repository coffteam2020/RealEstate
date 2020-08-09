import AsyncStorage from "@react-native-community/async-storage";

class IAStorageManager {
    static setItem = async (key, value) => {
    	try {
    		await AsyncStorage.setItem(key, JSON.stringify(value));
    	} catch (error) {
    		console.log(error.message);
    	}
    };

    static getItem = async (key) => {
    	try {
    		const retrievedItem = await AsyncStorage.getItem(key);
    		return JSON.parse(retrievedItem);
    	} catch (error) {
    		console.log("Get item error catch" + error.message);
    	}
    };

    static removeItem = async (key) => {
    	try {
    		await AsyncStorage.removeItem(key);
    	} catch(error) {
    		console.log("Remove item error" + error.message);
    	}
    }

}

export default IAStorageManager;