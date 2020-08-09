/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
/* eslint-disable valid-typeof */
import LogManager from '../logging/LogManager';
var md5 = require('md5');

String.prototype.replaceAll = function (search, replacement) {
	let target = this;
	return target.split(search).join(replacement);
};

String.prototype.format = function () {
	var a = this;
	for (var k in arguments) {
		a = a.replace(new RegExp('\\{' + k + '\\}', 'g'), arguments[k]);
	}
	return a;
};

String.prototype.format = function () {
	var args = [].slice.call(arguments);
	return this.replace(/(\{\d+\})/g, function (a) {
		return args[+(a.substr(1, a.length - 2)) || 0];
	});
};

export default class Utils {
	/**
	 * Chunk array
	 * @param {*} array
	 * @param {*} column
	 */
	static chunkArray(array, column = 1) {
		// if (!array || array.length <= 0)
		//     return []
		return array.reduce((acc, val) => {
			if (acc.length === 0) acc.push([]);
			const last = acc[acc.length - 1];
			if (last.length < column) {
				last.push(val);
			} else {
				acc.push([val]);
			}
			return acc;
		}, []);
	}
	/**
 * Calculate the range between startDate and endDate
 * @param {} startDate
 * @param {*} endDate
 */
	static durationDate(startDate, endDate) {
		let elapsedYears = 0;
		let elapsedMonths = 0;
		let elapsedDays = 0;
		let elapsedHours = 0;
		let elapsedMinutes = 0;
		let elapsedSeconds = 0;

		try {
			//milliseconds
			let different = endDate - startDate;

			let secondsInMilli = 1000;
			let minutesInMilli = secondsInMilli * 60;
			let hoursInMilli = minutesInMilli * 60;
			let daysInMilli = hoursInMilli * 24;
			let monthsInMilli = daysInMilli * 30;

			elapsedDays = parseInt(different / daysInMilli);
			different = different % daysInMilli;

			elapsedHours = parseInt(different / hoursInMilli);
			different = different % hoursInMilli;

			elapsedMinutes = parseInt(different / minutesInMilli);
			different = different % minutesInMilli;

			elapsedSeconds = different % secondsInMilli;

			elapsedMonths = parseInt(elapsedDays / 30);

			elapsedYears = parseInt(elapsedDays / 365);

		} catch (ex) {
			LogManager.showFullLog('Model.js-Model-durationDate-ex: ' + JSON.stringify(ex), true);
		}

		let objDate = {
			year: elapsedYears,
			month: elapsedMonths,
			day: elapsedDays,
			hour: elapsedHours,
			minute: elapsedMinutes,
			second: elapsedSeconds
		};

		LogManager.showFullLog('Model.js-Model-durationDate-objDate: ' + JSON.stringify(objDate));
		return objDate;
	}

	// static getNameOfMonth(month) {
	//     switch (month) {
	//         case 1:
	//             return strings.monthJan
	//         case 2:
	//             return strings.monthFeb
	//         case 3:
	//             return strings.monthMar
	//         case 4:
	//             return strings.monthApr
	//         case 5:
	//             return strings.monthMay
	//         case 6:
	//             return strings.monthJun
	//         case 7:
	//             return strings.monthJul
	//         case 8:
	//             return strings.monthAug
	//         case 9:
	//             return strings.monthSep
	//         case 10:
	//             return strings.monthOct
	//         case 11:
	//             return strings.monthNov
	//         case 12:
	//             return strings.monthDec
	//         default:
	//             return strings.monthJan
	//     }
	// }

	/**
     * Get month name by text
     * @param {} month_name
     */
	static getMonthFromShortName(month_name) {
		switch (month_name) {
		case 'Jan':
			return 1;
		case 'Feb':
			return 2;
		case 'Mar':
			return 3;
		case 'Apr':
			return 4;
		case 'May':
			return 5;
		case 'Jun':
			return 6;
		case 'Jul':
			return 7;
		case 'Aug':
			return 8;
		case 'Sep':
			return 9;
		case 'Oct':
			return 10;
		case 'Nov':
			return 11;
		case 'Dec':
			return 12;
		default:
			return 1;
		}
	}

	// input : 14-Dec-18
	static getDateFromShortDate(_dateString) {
		let dateParts = _dateString != null ? _dateString.split('-') : '';
		if (dateParts.length === 3) {
			let date = dateParts[0];
			let month = Utils.getMonthFromShortName(dateParts[1]);
			let year = '20' + dateParts[2];
			return new Date(year, month - 1, date);
		}
		return null;
	}

	static getDayNumber(day) {
		switch (day) {

		}
	}

	static getTimeFormServer(strTime) {
		try {
			let date = strTime ? new Date(strTime) : new Date();
			return date;
		} catch (ex) {
			LogManager.showFullLog('Model.js-Model-getTimeFormServer-ex: ' + JSON.stringify(ex), true);
		}
	}

	static formatMoneyToNumber(money) {
		try {
			if (money) {
				let moneyString = money.replaceAll(',', '').replaceAll('đ', '').replaceAll('.', '').replaceAll(' ', '');
				let number = Number(moneyString);
				if (isNaN(number)) {
					return 0;
				}
				return number;
			} else {
				return money;
			}

		} catch (error) {
			return money;
		}
	}

	static getCountDateToNow(dateString) {
		if (dateString != null) {
			let date = new Date(dateString);
			let dateNow = new Date();
			let oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

			let diff = Math.round(Math.abs((dateNow.getTime() - date.getTime()) / (oneDay)));

			if (diff == 0) {
				return this.padding(date.getHours()) + ':' + this.padding(date.getMinutes());
			} else if (diff < 30) {
				return (parseInt(diff) + ' ngày');
			} else if (diff > 30 && diff < 365) {
				return (parseInt(diff / 30) + ' tháng');
			} else {
				return (parseInt(diff / 365) + ' năm');
			}
		}
		return null;
	}

	static getCountDate(dateAString, dateBString) {
		if (dateAString && dateBString) {
			let dateA = new Date(dateAString);
			let dateB = new Date(dateBString);
			let oneSecond = 1000; // hours*minutes*seconds*milliseconds

			let diff = Math.round(Math.abs((dateB.getTime() - dateA.getTime()) / (oneSecond)));

			return diff;

		}
		return null;
	}

	static getDateFromString(dateString, format) {
		if (dateString != null) {
			let components = dateString.split(' ');
			if (components.length == 2) {
				if (format == 'dd/MM/YYYY HH:mm:ss') {
					let dateString = components[0];
					let timeString = components[1];
					let dateParts = dateString != null ? dateString.split('/') : '';
					let timeParts = timeString != null ? timeString.split(':') : '';
					if (dateParts.length == 3 && timeParts.length == 3) {
						let dateNo = dateParts[1] - 1;
						let date = new Date(dateParts[2], dateNo, dateParts[0], timeParts[0], timeParts[1], timeParts[2]);
						return date;
					}
				} else if (format == 'YYYY-MM-dd HH:mm:ss') {
					let dateString = components[0];
					let timeString = components[1];
					let dateParts = dateString != null ? dateString.split('-') : '';
					let timeParts = timeString != null ? timeString.split(':') : '';
					if (dateParts.length == 3 && timeParts.length == 3) {
						let dateNo = dateParts[1] - 1;
						let date = new Date();
						date.setFullYear(dateParts[0]);
						date.setMonth(dateNo);
						date.setDate(dateParts[2]);
						date.setHours(timeParts[0]);
						date.setMinutes(timeParts[1]);
						date.setSeconds(timeParts[2]);
						// let date = new Date(dateParts[0], dateNo, dateParts[2], timeParts[0], timeParts[1], timeParts[2]);
						LogManager.showFullLog(`Utils.js-Utils-getDateFromString-data:
                        ${dateParts[0] + '-' + dateNo + '-' + dateParts[2] + '-' +
							timeParts[0] + '-' + timeParts[1] + '-' + timeParts[2]}`);
						return date;
					}
				}
			}
			else {
				let dateString = components[0];
				if (dateString != null) {
					let dateParts = dateString.split('/');
					if (dateParts.length == 3) {
						let dateNo = dateParts[1] - 1;
						let date = new Date(dateParts[2], dateNo, dateParts[0]);
						return date;
					}
				}
			}
		}
		return null;
	}

	//"20/07/2016 22:35:00"
	static getHourMinute(_dateString) {
		let dateString = _dateString
			, reggie = /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})/
			, [,,,, hours, minutes] = reggie.exec(dateString);

		return hours + ':' + minutes;
	}

	static getHourMinuteFromMilisecond(date) {
		if ((typeof date) === 'string') {
			date = parseInt(date);
		}
		let mDate = new Date(date);
		return this.getHourMinuteFromDate(mDate);
	}

	static getHourMinuteFromDate(date) {
		return this.padding(date.getHours()) + ':' + this.padding(date.getMinutes());
	}

	static formatDatehhmm_ddMMyyyy(date) {
		if ((typeof date) === 'string') {
			date = parseInt(date);
		}
		let mDate = new Date(date);
		return this.getHourMinuteFromDate(mDate) + ' - ' + this.formatDate(mDate);
	}

	//"20/07/2016 22:35:00"
	static getDateOfWeek(_dateString) {
		// let dateString = _dateString
		//     , reggie = /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})/
		//     , [,day, month, year, hours, minutes, seconds] = reggie.exec(dateString);

		let d = this.getDateFromString(_dateString, 'dd/MM/YYYY HH:mm:ss');

		let weekday = new Array(7);
		weekday[0] = 'Chủ Nhật';
		weekday[1] = 'Thứ 2';
		weekday[2] = 'Thứ 3';
		weekday[3] = 'Thứ 4';
		weekday[4] = 'Thứ 5';
		weekday[5] = 'Thứ 6';
		weekday[6] = 'Thứ 7';

		let Thu = weekday[d.getDay()];
		return Thu + ', ' + this.formatDate(d);
	}


	// static getDayOfWeekFromDate(date)
	// {
	//     // let dateString = _dateString
	//     //     , reggie = /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})/
	//     //     , [,day, month, year, hours, minutes, seconds] = reggie.exec(dateString);
	//     let weekday = new Array(7);

	//     weekday[0] = strings.sun;
	//     weekday[1] = strings.mon;
	//     weekday[2] = strings.tues;
	//     weekday[3] = strings.wed;
	//     weekday[4] = strings.thurs;
	//     weekday[5] = strings.fri;
	//     weekday[6] = strings.sat;

	//     let Thu = weekday[date.getDay()];
	//     return Thu;
	// }
	//"20/07/2016 22:35:00"
	static getDateOfYear(_dateString) {
		let dateString = _dateString
			, reggie = /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})/
			, [, day, month, year,,] = reggie.exec(dateString);

		return day + '/' + month + '/' + year;
	}

	//04-12-2018 11:00
	static getDateOfYearFromString(date) {
		if (date && date.length == 16) {
			return date.substr(0, 10).replaceAll('-', '/');
		}
		return date;
	}

	static formatDayStringddMMyyyyTodd_MM_yyyy(date) {
		if (date && date.length == 8) {
			return date.substr(0, 2) + '/' + date.substr(2, 2) + '/' + date.substr(4);
		}
		return date;
	}

	// static formatDay(date) {
	//     let WEEKDAYSNAME = [strings.mon, strings.tues, strings.wed, strings.thurs, strings.fri, strings.sat, strings.sun,];
	//     let dateFormatted = this.formatDate(date);
	//     let day = date.getDay();
	//     if (date.getDay() == 0) {
	//         day = 7;
	//     }
	//     return WEEKDAYSNAME[day - 1];
	// }

	static formatFullDate(date) {
		let dateFormatted = this.formatDate(date);
		let day = this.formatDay(date);

		return day + ', ' + dateFormatted;
	}

	static formatDateMilisecond(date) {
		if ((typeof date) === 'string') {
			date = parseInt(date);
		}
		let mDate = new Date(date);
		return this.formatDate(mDate);
	}

	static formatDate(date) {
		try {
			// LogManager.showFullLog("Model.js-Model-formatDate: "+(typeof  date)+" -- "+date);
			if (typeof date != 'date') {
				if ((typeof date) === 'string') {
					date = parseInt(date);
				}
				date = new Date(date);
			}
			if (date) {
				return this.padding(date.getDate()) + '/' +
					this.padding(date.getMonth() + 1) + '/' +
					(date.getFullYear()).toString();
			}
		} catch (ex) {
			LogManager.showFullLog('Model.js-Model-formatDate-ex: ' + JSON.stringify(ex), true);
		}
		return null;
	}

	// yyyy-MM-dd
	static formatDateToString(date) {
		var dateString = this.formatDate(date);
		let dd = dateString.substring(0, 2);
		let mm = dateString.substring(3, 5);
		let yyyy = dateString.substring(6, 10);
		return yyyy + '-' + mm + '-' + dd;
	}

	static getOldFromYear(year = new Date().getFullYear()) {
		return this.durationDate(new Date(year, 1, 1, 0, 0, 0), new Date());
	}

	static formatDateYear(date) {
		if (date) {
			return 'Tháng ' + (date.getMonth() + 1).toString() + '/' +
				(date.getFullYear()).toString();
		}
		return null;
	}

	static getCurrentDateWithTimezone(country) {
		var date = new Date();
		return date.toLocaleString(country);
	}

	static pad(number, length) {
		var str = '' + number;
		while (str.length < length) {
			str = '0' + str;
		}
		return str;
	}

	static getTimeZoneOffsetOfDate() {
		let offsetStr = '';
		var offset = new Date().getTimezoneOffset();
		offset = ((offset < 0 ? '+' : '-') +
			this.pad(parseInt(Math.abs(offset / 60)), 2));
		return offsetStr = 'GMT ' + offset;
	}

	// return: Thu 2, 16 thang 5, 2018
	static getFullTimeTextWithLocale(time) {
		let date = time;
		if (typeof time != 'date') {
			if ((typeof time) === 'string') {
				date = new Date(parseInt(time));
			}
		}
		let dayOfWeek = Utils.getDayOfWeekFromDate(date);
		let monthOfYear = Utils.getNameOfMonth(date.getMonth() + 1);
		let dayOfMonth = date.getDate();
		let year = date.getFullYear();
		let timeVNFormat = dayOfWeek + ' - ' + dayOfMonth + ' ' + monthOfYear + ', ' + year;
		return timeVNFormat;
	}

	// return: 16 thang 5, 2018
	static getTimeTextWithLocale(time) {
		let date = time;
		if (typeof time != 'date') {
			if ((typeof time) === 'string') {
				date = new Date(parseInt(time));
			}
		}
		let monthOfYear = Utils.getNameOfMonth(date.getMonth() + 1);
		let dayOfMonth = date.getDate();
		let year = date.getFullYear();
		let timeVNFormat = dayOfMonth + ' ' + monthOfYear + ', ' + year;
		return timeVNFormat;
	}

	static compareDateTime(date1, date2) {
		if (date1 && date2) {
			let time1 = date1.getTime();
			let time2 = date2.getTime();
			return this.compareTime(time1, time2);
		}
		return null;
	}

	static compareTime(time1, time2) {
		if (time1 && time2) {
			if (time1 > time2) {
				return 1;
			} else if (time1 === time2) {
				return 0;
			} else {
				return -1;
			}
		}
		return null;
	}

	static compareDate(date1, date2) {
		if (date1 && date2) {
			let dateTime = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
			let dateTime2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
			return this.compareDateTime(dateTime, dateTime2);
		}
		return null;
	}

	static dectectChar(name) {
		let re = /^[a-zA-Z ]*$/i;
		LogManager.showFullLog('dectectChar: ' + re.test(name));
		return re.test(name);
	}

	static dectectUserName(name) {
		let re = /^[a-zA-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]*$/i;
		return re.test(name);
	}

	static dectectPhoneNumber(phoneNum) {
		if (phoneNum) {
			let filter = /^[0-9-+]+$/;
			if (filter.test(phoneNum) && (phoneNum.length == 10 || phoneNum.length == 11)) {
				return true;
			}
			else {
				return false;
			}
		}
		return false;
	}

	static dectectOTP(otp) {
		let filter = /^[0-9-+]+$/;
		if (filter.test(otp) && (otp.length == 5)) {
			return true;
		}
		else {
			return false;
		}
	}

	// static dectectEmail(email) {
	// 	let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	// 	return re.test(email);
	// }

	// static detectEmailUnicode(email) {
	// 	let re = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
	// 	return re.test(email);
	// }

	static clearSpace(text) {
		return text.replace(/ +/g, '');
	}

	static isNumber(t) {
		let check = false;
		if (t.trim().length > 0) {
			check = !isNaN(t);
		}
		return check;
	}

	static checkIsNumber(number) {
		let re = /^[0-9]+$/;
		return re.test(number);
	}

	//Khoa.Tran 11/7/2016 Begin Util
	static isNumeric(n) {
		let res = !isNaN(parseFloat(n)) && isFinite(n);
		return res;
	}

	static removeAreaCode(phone1) {
		let phone = phone1 + '';
		if (phone.startsWith('84')) {
			phone = phone.substring(2);
		} else if (phone.startsWith('84-')) {
			phone = phone.substring(3);
		} else if (phone.startsWith('+84')) {
			phone = phone.substring(3);
		} else if (phone.startsWith('+84-')) {
			phone = phone.substring(4);
		} else if (phone.startsWith('(+84)')) {
			phone = phone.substring(5);
		}
		phone = this.add0ToPhoneNumber(phone);
		return phone;
	}

	static add0ToPhoneNumber(phone) {
		if (!phone.startsWith('0')) {
			phone = '0' + phone;
		}
		return phone;
	}


	//Khoa.Tran 11/7/2016 End Util

	static roundNum(num) {
		return (Math.round(num * 100) / 100);
	}

	static getInfoCarrier(_phoneNumber) {
		let _result = {
			carrierName: 'Chưa xác định',
			carrierSite: '',
			carrierImageURL: 'http://khong.hinh.jpg',
		};

		if (_phoneNumber == undefined) {
			return _result;
		}

		let _phoneNumber3 = _phoneNumber.substring(0, 3);
		let _phoneNumber4 = _phoneNumber.substring(0, 4);

		//Viettel
		if (_phoneNumber3 == '096' || _phoneNumber3 == '097' || _phoneNumber3 == '098' || _phoneNumber4 == '086' ||
			_phoneNumber4 == '0163' || _phoneNumber4 == '0164' || _phoneNumber4 == '0165' || _phoneNumber4 == '0166' ||
			_phoneNumber4 == '0167' || _phoneNumber4 == '0168' || _phoneNumber4 == '0169') {
			_result.carrierName = 'Viettel';
			_result.carrierSite = 'www.vietteltelecom.vn';
		} else
		//Mobifone
		if (_phoneNumber3 == '090' || _phoneNumber3 == '093' || _phoneNumber3 == '089' ||
				_phoneNumber4 == '0120' || _phoneNumber4 == '0121' || _phoneNumber4 == '0122' ||
				_phoneNumber4 == '0126' || _phoneNumber4 == '0128') {
			_result.carrierName = 'Mobifone';
			_result.carrierSite = 'www.mobifone.com.vn';
		} else
		//Vinaphone
		if (_phoneNumber3 == '091' || _phoneNumber3 == '094' || _phoneNumber3 == '088' ||
					_phoneNumber4 == '0123' || _phoneNumber4 == '0124' || _phoneNumber4 == '0125' ||
					_phoneNumber4 == '0127' || _phoneNumber4 == '0129') {
			_result.carrierName = 'Vinaphone';
			_result.carrierSite = 'wwww.vinaphone.com.vn';

		} else

		//Vietnamobile
		if (_phoneNumber3 == '092' || _phoneNumber4 == '0199') {
			_result.carrierName = 'Vietnamobile';
			_result.carrierSite = 'wwww.vietnammobile.com.vn';
		} else
		//GMobile
		if (_phoneNumber4 == '0996' || _phoneNumber4 == '0199') {
			_result.carrierName = 'Gmobile';
			_result.carrierSite = 'wwww.gmobile.vn';
		} else
		//SFone
		if (_phoneNumber3 == '095') {
			_result.carrierName = 'SFone';
			_result.carrierImageURL = 'SFone';
		}
		return _result;
	}

	static formatPhoneNumberLocal(phoneNumber) {
		let firstChar = phoneNumber.substring(0, 2);
		let endChar = phoneNumber.substring(2, phoneNumber.length);
		let res = '';
		if (firstChar == '84') {
			res = '0' + endChar;
		} else if (phoneNumber.substring(0, 1) != '0') {
			res = '0' + phoneNumber;
		} else {
			res = phoneNumber;
		}

		return res;
	}

	static isArray(val) {
		return (Object.prototype.toString.call(val) === '[object Array]');
	}

	static uniqueID() {
		let number = Math.random().toString(36).substr(2, 9);

		return number;
	}

	static randomInRange(start, end) {
		return Math.floor(Math.random() * (end - start + 1) + start);
	}

	static convertTime(time, formatType = 'hh:mm dd/MM/YYYY') {
		let date = time;
		if (typeof time != 'date') {
			if ((typeof time) === 'string') {
				date = new Date(parseInt(time));
			}
		}
		LogManager.showFullLog(`Utils.js-Utils-convertTime-data: ${LogManager.parseJsonObjectToJsonString(date)}`);
		let numDate = date.getDate();
		let strDate = numDate < 10 ? '0' + numDate : numDate;
		let numMonth = date.getMonth() + 1;
		let strMonth = numMonth < 10 ? '0' + numMonth : numMonth;
		let strYear = date.getFullYear();
		let strHours = date.getHours();
		strHours = strHours > 9 ? strHours : '0' + strHours;
		let strMinutes = date.getMinutes();
		strMinutes = strMinutes > 9 ? strMinutes : '0' + strMinutes;
		if (formatType == 'hh:mm dd/MM/YYYY')
			return (strHours + ':' + strMinutes + ' ' + strDate + '/' + strMonth + '/' + strYear);
		else if (formatType == 'dd/MM/YYYY') {
			return (strDate + '/' + strMonth + '/' + strYear);
		}
		else if (formatType == 'YYYY-MM-dd') {
			return (strYear + '-' + strMonth + '-' + strDate);
		}
		else if (formatType == 'dd/MM/YYYY hh:mm') {
			return (strDate + '/' + strMonth + '/' + strYear + ' ' + strHours + ':' + strMinutes);
		}
		else if (formatType == 'dd/MM/YYYY - hh:mm') {
			return (strDate + '/' + strMonth + '/' + strYear + ' - ' + strHours + ':' + strMinutes);
		}
		else if (formatType == 'hh:mm') {
			return (strHours + ':' + strMinutes);
		}
		else if (formatType == 'YYYYMMDDHHMM') {
			return (strYear + strMonth + strDate + strHours + strMinutes);
		}
		else if (formatType == 'yyyy-MM-dd HH:mm:ss') {
			return (strYear + '-' + strMonth + '-' + strDate + ' ' + strHours + ':' + strMinutes + ':00');
		}
		else {
			return '';
		}
	}

	static getDate(date) {
		let daytmp = new Date(parseInt(date)).getDate();
		let daytmpStr = daytmp > 9 ? daytmp : '0' + daytmp;
		let monthtmp = new Date(parseInt(date)).getMonth() + 1;
		let monthtmpStr = monthtmp > 9 ? monthtmp : '0' + monthtmp;
		let yeartmp = new Date(parseInt(date)).getFullYear();
		return {day: daytmpStr, month: monthtmpStr, year: yeartmp};
	}

	static sumTotal(arr, prop) {
		let total = 0;
		for (let i = 0, _len = arr.length; i < _len; i++) {
			total += parseFloat(arr[i][prop]);
		}
		return total;
	}

	static padding(input) {
		return (input > 9 ? input : '0' + input) + '';
	}

	static getCurrentTotalMiliSeconds() {
		let d = new Date();
		let n = d.getTime();
		return n;
	}

	static getCurrentTotalSeconds() {
		let d = new Date();
		let n = d.getTime() / 1000;
		return n;
	}

	static getCurrentDate() {
		let d = new Date();
		return d;
	}

	static removeAlias(alias) {
		let str = alias;
		//str= str.toLowerCase();
		str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ {2}|ặ|ẳ|ẵ/g, 'a');
		str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
		str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
		str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ {2}|ợ|ở|ỡ/g, 'o');
		str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
		str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
		str = str.replace(/đ/g, 'd');
		str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ {2}|Ặ|Ẳ|Ẵ/g, 'A');
		str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
		str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
		str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ {2}|Ợ|Ở|Ỡ/g, 'O');
		str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
		str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
		str = str.replace(/Đ/g, 'D');
		//str= str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g,"-");
		return str;
	}

	static isVietNamese(text) {
		let strNone = this.removeAlias(text);
		if (strNone == text) {
			return false;
		}
		return true;
	}

	static decodeHtmlEntity(str) {
		let entities = [
			['apos', '\''],
			['amp', '&'],
			['lt', '<'],
			['gt', '>'],
			['quot', '"'],
		];
		for (let i = 0, max = entities.length; i < max; ++i)
			str = str.replace(new RegExp('&' + entities[i][0] + ';', 'g'), entities[i][1]);

		return str.replace(/&#(\d+);/g, function (match, dec) {
			return String.fromCharCode(dec);
		});
	}

	// TanNguyen.
	// I dont think it should work for some case like ....... (blank for a while)
	// Let me know if you has another argue
	// I wrote another one.

	static isTextEmpty(str) {
		if (str && str.length > 0) {
			return false;
		}
		return true;
	}

	// TanNguyen: Check with regex.
	// Update text isTextEmpty.
	static isEmpty(str) {
		return ((/^\s*$/).test(str));
	}

	static formatString(source, ...agr) {
		source.format(agr);
	}

	static isGoodUserId(userId, length) {
		return userId.length >= length;
	}
	static isPasswordMatchConfirmPassword(pass, confirmPass) {
		return new String(pass).valueOf() == new String(confirmPass).valueOf();
	}
	static compareTwoObjects(obj1, obj2) {
		return JSON.stringify(obj1) === JSON.stringify(obj2);
	}

	/**
     * Get current function name
     */
	static getFuncName() {
		// eslint-disable-next-line no-undef
		return getFuncName.name;
	}

	static encrypt(text) {
		return md5(text);
	}

}