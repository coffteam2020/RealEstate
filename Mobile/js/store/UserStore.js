import {observable, action} from 'mobx';
import {TimeHelper} from '../shared/utils/helper/timeHelper';
import LogManager from '../shared/utils/logging/LogManager';

export class UserStore {
    // Authentication
    @observable userLoginInfo = {
    	email: '',
    	password: ''
    }
    @observable userInfo = undefined;
    @observable userKey = undefined;
    @observable userId = undefined;
    @observable userRegisterBeing = {};

    // User data
    @observable userNotifications = [];
    @observable userNotificationUnread = 0;
    @observable userTaskFinished = 0;
    @observable userTask = [];
    @observable userFlyMessageRemaining = 0;

    // Song
    @observable songs = [];
    @observable currentSong = null;
    @observable currenIndexSong = -1;

    // User attachments
    @observable userAttachments = [];

    // User careTeam
    @observable userCareTeam = [];

    // User questions
    @observable userQuestions = [];

    // User doctor  temp
    @observable doctor = [];

    // Messages conversation
    @observable messages = [];
    @observable currentRoom = '';

    //  items data
    @observable items = [];
    @observable itemsBag = [];
    @observable blockList = [];
    @observable friendList = [];

    // Actions
    @action.bound
    setUserInfoLogin = (email, password) => {
    	this.userLoginInfo.email = email;
    	this.userLoginInfo.password = password;
    }

    @action.bound
    setUserInfo = (data) => {
    	this.userInfo = data;
    }
    @action.bound
    setFlyMessageRemain = (data) => {
    	this.userFlyMessageRemaining = data;
    }
    @action.bound
    setUserKey = (userKey) => {
    	this.userKey = userKey;
    }
    @action.bound
    setCurrentChatRoom = (room) => {
    	this.currentRoom = room;
    }

    @action.bound
    setUserRegisterBeing = (data) => {
    	this.userRegisterBeing = data;
    }

    @action.bound
    setNotificationUnread = () => {
    	let count = 0;
    	this.userNotifications.forEach(item => {
    		if (!item.hasRead) {
    			count++;
    		}
    	});
    	this.userNotificationUnread = count;
    }

    @action.bound
    setUserNotification = (data) => {
    	this.userNotifications = data;
    	this.setNotificationUnread();
    }

    @action.bound
    setTaskFinished = () => {
    	let count = 0;
    	this.userTask.forEach(item => {
    		if (item.status === 1) {
    			count++;
    		}
    	});
    	this.userTaskFinished = count;
    }

    @action.bound
    setItems = (data) => {
    	this.items = data;
    }
    @action.bound
    setItemsBag = (data) => {
    	this.itemsBag = data;
    }
    @action.bound
    setBlockList = (data) => {
    	this.blockList = data;
    }
    @action.bound
    setSongs = (data) => {
    	this.songs = data;
    }
    @action.bound
    setCurrentSongs = (data) => {
    	this.currentSong = data;
    }
    @action.bound
    setCurrentIndexSongs = (data) => {
    	this.currenIndexSong = data;
    }
    @action.bound
    setFriendList = (data) => {
    	this.friendList = data;
    }

    @action.bound
    setUserTask = (data) => {
    	let currentTime = TimeHelper.getTimeEndOfDate();
    	let currentStartTime = TimeHelper.getTimeStartOfDate();
    	let taskConvert = data.filter(item => item.end <= currentTime && item.start >= currentStartTime);
    	this.userTask = taskConvert;
    	this.setTaskFinished();
    }

    @action.bound
    addDoctorCareTeam = (doctor) => {
    	if (this.userInfo.doctors && Array.isArray(this.userInfo.doctors)) {
    		let temp = this.userInfo.doctors && this.userInfo.doctors || [];
    		if (temp.findIndex(a => a.id === doctor.id) === -1) {
    			temp = temp.concat([doctor]);
    			this.userInfo = {...this.userInfo, doctors: temp};
    		} else {
    			temp = temp.filter(a => a.id !== doctor.id);
    			this.userInfo = {...this.userInfo, doctors: temp};
    		}
    	} else {
    		this.userInfo = {...this.userInfo, doctors: [doctor]};
    	}
    	LogManager.write(this.userInfo);
    }

    @action.bound
    addNewUserTask = (item) => {
    	this.userTask = this.userTask.concat([item]);
    	this.setTaskFinished();
    }

    @action.bound
    updateTaskStatusDoneLocal = (taskId) => {
    	let objTemp = null;
    	let tempTasks = [];
    	for (let i = 0; i < this.userTask.length; i++) {
    		if (this.userTask[i].id === taskId) {
    			objTemp = this.userTask[i];
    			objTemp.status = 1;
    			tempTasks = this.userTask.filter(item => item.id !== taskId);
    			break;
    		}
    	}
    	tempTasks.push(objTemp);
    	this.userTask = tempTasks;
    }


    // Attachment
    @action.bound
    setUserAttachments = (data) => {
    	this.userAttachments = data;
    }


    // Question
    @action.bound
    setUserQuestion = (data) => {
    	this.userQuestions = data;
    }

    // careTeam
    @action.bound
    setUserCareTeam = (data) => {
    	if (data && Array.isArray(data)) {
    		this.userCareTeam = data;
    	} else {
    		this.userCareTeam = [];
    	}
    }

    // Doctors
    @action.bound
    setDoctors = (doctor) => {
    	if (doctor && Array.isArray(doctor)) {
    		this.doctor = doctor;
    	} else {
    		this.doctor = [];
    	}
    }

    // Doctors
    @action.bound
    checkDoctorBelongCareTeam = (doctorId) => {
    	if (this.userInfo.doctors && this.userInfo.doctors.length > 0) {
    		let index = this.userInfo.doctors.findIndex(item => item.id === doctorId);
    		return index !== -1;
    	}
    	return false;
    }

    // Messages
    @action.bound
    setMessages = (data) => {
    	this.messages = data;
    }
}
