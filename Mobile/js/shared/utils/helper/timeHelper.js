var moment = require('moment-timezone');
export const ENUM_TIME_FORMAT = {
	DEFAULT_TIME_FORMAT: 'YYYY-MM-DDTHH:mm:ss.sssZ',
	FULL: 'YYYY/MM/DD HH:mm:ss',
	FULL_HOR: 'YYYY-MM-DD HH:mm',
	YEAR_LESS_MONTH_DATE: 'YY/MM/DD',
	YEAR_MONTH_DATE: 'YYYY/MM/DD',
	DATE_MONTH: 'DD/MM',
	MONTH_YEAR_LESS: 'MM/YY',
	MONTH_YEAR: 'MM/YYYY',
	DATE_MONTH_YEAR_LESS: 'DD/MM/YY',
	DATE_MONTH_YEAR: 'DD/MM/YYYY',
	HOUR_MIN: 'hh:mm',
	HOUR_MIN_SEC: 'hh:mm:ss',
};

function convertTimeWithDefaultFormat(time) {
	if (!time || time === '') {
		return '';
	}
	var timeFormatted = moment(time).format(ENUM_TIME_FORMAT.DATE_MONTH);
	return timeFormatted;
}

function getCurrentTimeWithDefaultFormat(time) {
	if (time || time !== '') {
		return moment(time).format(ENUM_TIME_FORMAT.DATE_MONTH);
	}
	return moment().format(ENUM_TIME_FORMAT.DATE_MONTH);
}

function convertTimeDDMMYY(time) {
	if (!time || time === '') {
		return '';
	}
	return moment(time).format(ENUM_TIME_FORMAT.DATE_MONTH_YEAR_LESS);
}

function getCurrentYear() {
	return moment().year();
}

function getCurrentMonth() {
	return moment().month();
}

// Default format is YYYY-MM-DDTHH:mm:ss.sssZ for all the time object.
function convertTimeFromDefaultFormat(time, outputFormat) {
	if (!time || time === '') {
		return '';
	}
	let timeConverted = moment(time).format(ENUM_TIME_FORMAT.DEFAULT_TIME_FORMAT);
	var timeFormatted = moment(timeConverted).format(
		(outputFormat && outputFormat) || ENUM_TIME_FORMAT.DATE_MONTH_YEAR,
	);
	return timeFormatted;
}

// Default format is YYYY-MM-DDTHH:mm:ss.sssZ for all the time object.
function getTimeDefaultFormat(time) {
	if (!time || time === '') {
		return moment().format(ENUM_TIME_FORMAT.DEFAULT_TIME_FORMAT);
	}
	let timeConverted = moment(time).format(ENUM_TIME_FORMAT.DEFAULT_TIME_FORMAT);
	return timeConverted;
}

// Default format is FULL for all the time object.
function getTimeDefaultFormatFull(time) {
	if (!time || time === '') {
		return moment().format(ENUM_TIME_FORMAT.DEFAULT_TIME_FORMAT);
	}
	let timeConverted = moment(time).format(ENUM_TIME_FORMAT.FULL);
	return timeConverted;
}
// Default format is FULL for all the time object.
function getTimeDefaultFormatFullHor(time) {
	if (!time || time === '') {
		return moment().format(ENUM_TIME_FORMAT.DEFAULT_TIME_FORMAT);
	}
	let timeConverted = moment(time).format(ENUM_TIME_FORMAT.FULL_HOR);
	return timeConverted;
}

// Default format is YYYY-MM-DDTHH:mm:ss.sssZ for all the time object.
function getTimeBeginOfMonthDefaultFormat() {
	return moment()
		.startOf('month')
		.format(ENUM_TIME_FORMAT.DEFAULT_TIME_FORMAT);
}

// Default format is YYYY-MM-DDTHH:mm:ss.sssZ for all the time object.
function getTimeEndOfMonthDefaultFormat() {
	return moment()
		.endOf('month')
		.format(ENUM_TIME_FORMAT.DEFAULT_TIME_FORMAT);
}

//Start date
function getTimeStartOfDate() {
	let time = new Date();
	let currentTime = new Date(time.getFullYear(), time.getMonth(), time.getDate(), 0, 0, 0);
	return currentTime.getTime();
}
//End date
function getTimeEndOfDate() {
	let time = new Date();
	let currentTime = new Date(time.getFullYear(), time.getMonth(), time.getDate(), 23, 59, 59);
	return currentTime.getTime();
}

function dateFromNow(time, format = 'ddd') {
	let currentDate = moment();
	let oldDate = moment(time, 'YYYY-MM-DD\'T\'HH:mm:ssZ');

	if (isToday(oldDate)) {
		return oldDate.format('HH:mm');
	}

	let days = currentDate.diff(oldDate, 'days');
	if (days < 7) {
		return oldDate.format(format);
	}

	return oldDate.format('MMM DD');
}

function isToday(date) {
	var TODAY = moment().clone().startOf('day');
	return date.isSame(TODAY, 'd');
}

export const TimeHelper = {
	convertTimeFromDefaultFormat,
	convertTimeWithDefaultFormat,
	convertTimeDDMMYY,
	getCurrentTimeWithDefaultFormat,
	getTimeDefaultFormatFullHor,
	getTimeBeginOfMonthDefaultFormat,
	getTimeEndOfMonthDefaultFormat,
	getTimeDefaultFormat,
	getCurrentMonth,
	getCurrentYear,
	getTimeDefaultFormatFull,
	getTimeStartOfDate,
	getTimeEndOfDate,
	dateFromNow,
	isToday,

};