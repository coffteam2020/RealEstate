import IAStorageManager from './IAStorageManager';
import Constant from '../constant/Constant';

class IALocalStorage {

  /**
   * Set/get TOKEN for FIRST TIME GO TO APP
   */
  static setTokenFirstTime = async (tokenFirstTime) => {
  	await IAStorageManager.setItem(Constant.USER.TOKEN_FIRST_TIME, tokenFirstTime);
  }
  static getTokenFirstTime = async () => {
  	return await IAStorageManager.getItem(Constant.USER.TOKEN_FIRST_TIME);
  }

  /**
   * Set/get USER INFO
   */
  static setUserInfo = async (userInfo) => {
  	await IAStorageManager.setItem(Constant.USER.USER_INFO, userInfo);
  }

  static getUserInfo = async () => {
  	return await IAStorageManager.getItem(Constant.USER.USER_INFO);
  }

  /**
   * Set/get USER INFO
   */
  static setDetailUserInfo = async (userInfo) => {
  	await IAStorageManager.setItem(Constant.USER.USER_DETAIL_INFO, userInfo);
  }

  static getDetailUserInfo = async () => {
  	return await IAStorageManager.getItem(Constant.USER.USER_DETAIL_INFO);
  }

  /**
   * Set/get USER INFO Apple
   */
  static setDetailUserInfoApple = async (userInfo) => {
  	await IAStorageManager.setItem('APPLE_ID_EMAIL', userInfo);
  }

  static getDetailUserInfoApple = async () => {
  	return await IAStorageManager.getItem('APPLE_ID_EMAIL');
  }
  /**
   * Set/get screen
   */
  static setScreen = async (screen) => {
  	await IAStorageManager.setItem('SCREEN', screen);
  }

  static getScreen = async () => {
  	return await IAStorageManager.getItem('SCREEN');
  }
  /**
   * Set/get room
   */
  static setRoom = async (room) => {
  	await IAStorageManager.setItem('ROOM', room);
  }

  static getRoom = async () => {
  	return await IAStorageManager.getItem('ROOM');
  }
  /**
   * Set/get USER friend delete
   */
  static setUserDeleted = async (users) => {
  	await IAStorageManager.setItem(Constant.USER.USER_DELETE, users);
  }

  static getUserDeleted = async () => {
  	return await IAStorageManager.getItem(Constant.USER.USER_DELETE);
  }

  /**
   * Set/get user TOKEN info
   */
  static setTokenUserInfo = async (tokenUserInfo) => {
  	await IAStorageManager.setItem(Constant.USER.TOKEN_INFO, tokenUserInfo);
  }

  static getTokenUserInfo = async () => {
  	return await IAStorageManager.getItem(Constant.USER.TOKEN_INFO);
  }

  /**
   * Set/get device TOKEN info
   */
  static setDeviceToken = async (deviceToken) => {
  	await IAStorageManager.setItem(Constant.USER.DEVICE_TOKEN, deviceToken);
  }

  static getDeviceToken = async () => {
  	return await IAStorageManager.getItem(Constant.USER.DEVICE_TOKEN);
  }


  /**
   * Set/get searches
   */
  static setSearch = async (q) => {
  	let data = [];
  	data = await this.getSearch();
  	if (Array.isArray(data)) {
  		data.push(q);
  	} else {
  		data = [];
  	}
  	await IAStorageManager.setItem(Constant.USER.SEARCH, data);
  }

  static getSearch = async () => {
  	let a = await IAStorageManager.getItem(Constant.USER.SEARCH);
  	if (Array.isArray(a)) {
  		return a;
  	} else {
  		return [];
  	}
  }


  /**
   * Reset all token and user info
   */
  static resetLocalStorage = async () => {
  	await IAStorageManager.removeItem(Constant.USER.TOKEN_INFO);
  	await IAStorageManager.removeItem(Constant.USER.USER_INFO);
  	await IAStorageManager.removeItem(Constant.USER.TOKEN_FIRST_TIME);
    await IAStorageManager.removeItem(Constant.USER.SEARCH);
    await IAStorageManager.removeItem(Constant.USER.USER_DETAIL_INFO);
  }

}

export default IALocalStorage;