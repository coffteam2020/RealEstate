/* eslint-disable no-undef */
import { Platform } from "react-native";

String.prototype.replaceAll = function (search, replacement) {
	var target = this;
	return target.split(search).join(replacement);
};

export default class LogManager {
	static showFullLog(data_) {
		try {
			if (__DEV__) {
				if (typeof data_ === "object") {
					data_ = this.parseJsonObjectToJsonString(data_);
				}
				else {
					data_ = data_ + "";
				}

				let begin = 0;
				let end = 3000;
				if (data_.length < end || Platform.OS === "ios") {
					this.log(data_);
				} else {
					let res = data_.substring(begin, end);
					this.log(res);
					this.showFullLog(data_.substring(end, data_.length));
				}
			}
		}
		catch (err) {
			this.log(err);
		}
	}

	static parseJsonStringToJson(stringObject, parse = false) {
		if (stringObject && typeof stringObject === "string" && stringObject.length > 0) {
			try {
				if (!stringObject
					|| stringObject == null
					|| typeof stringObject == "undefined"
					|| stringObject.length == 0) {
					return null;
				}
				if (Platform.OS === "ios" && stringObject.startsWith("\"{") !== -1) {
					let strJSon = stringObject.replaceAll("\\r\\n", "");
					if (parse === false) {
						strJSon = stringObject.replace("\"{", "{");
						strJSon = strJSon.substring(0, strJSon.length - 2);
					}
					this.showFullLog("LogManager.js-LogManager-parseJsonStringToJson-stringObject: " + stringObject);
					return JSON.parse(strJSon);
				}
				return JSON.parse(stringObject);
			} catch (ex) {
				this.showFullLog("LogManager.js-LogManager-parseJsonStringToJson-ex: " + stringObject + " --- " + JSON.stringify(ex), true);
			}
		}
		return stringObject;
	}
	static write(obj) {
		console.log(JSON.parse(JSON.stringify(obj)));
	}
	static parseJsonObjectToJsonString(jsonObject) {
		if (jsonObject) {
			try {
				var seen = [];
				let json = JSON.stringify(jsonObject, function (key, val) {
					if (val != null && typeof val == "object") {
						if (seen.indexOf(val) >= 0) {
							return;
						}
						seen.push(val);
					}
					return val;
				});

				return json;
			} catch (ex) {
				return ex.message;
			}
		}
		return "";
		// return JSON.stringify(jsonObject);
	}
	static convertObjectArrayToArray(objArr) {
		if (objArr) {
			try {
				let arr = [];
				for (let j in objArr) {
					let item = objArr[j];
					arr.push(Object.assign({}, item));
				}
				return arr;
			} catch (ex) {
				this.showFullLog(ex);
				return [];
			}
		}
		return [];
	}

	static log(msg) {
		if (__DEV__ && msg) {
			console.log(msg);
		}
	}

	static replacceAll(strSource, chat, rep) {
		return strSource.replaceAll(chat, rep);
	}

	static replaceAllSpaceUrl(url) {
		url = url.trim();
		if (url.indexOf(" ") == -1) {
			return url;
		}
		return url.replaceAll(" ", "%20");
	}
}