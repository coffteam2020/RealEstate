/** @format */
// Use to validate single input field, form or any random value.
// NOTE: This model is not actually nice to work with pre-define form (that have their own error warning on each error).

import validate from "validate.js";
import I18n from "../locale/i18n";

const emailConstraints = {
	foo: {
		presence: {
			presence: true,
			message: I18n.t("validFieldEmpty")
		},
		email: {
			email: true,
			message: I18n.t("validEmailIncorrect")
		}
	}
};

const phoneConstraints = {
	foo: {
		presence: {
			presence: true,
			message: I18n.t("validFieldEmpty")
		},
		format: {
			pattern: "^[0-9]{9,12}$",
			flags: "i",
			message: I18n.t("validPhoneIncorrect")
		}
	}
};

const passwordConstraints = {
	foo: {
		presence: {
			presence: true,
			message: I18n.t("validFieldEmpty")
		},
		length: {
			minimum: 6,
			message: I18n.t("validPasswordIncorrect")
		}
	}
};

// eslint-disable-next-line no-unused-vars
const confirmPasswordConstraints = {
	foo2: {
		equality: "foo"
	}
};

const Validator = {
	// Most validate function receive a value (or a group of value) and return undefined if there is no error,
	// Otherwise, return a string as a error (or a array of strings for multi errors);

	/**
   * Check a string as email
   *
   * @param {string} input
   * @returns undefined as true, string as false
   */
	checkEmail(input) {
		if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(input)) {
			return true
		}
		return false
	},

	/**
   * Check a string as phone
   *
   * @param {string} input
   * @returns undefined as true, string as false
   */
	checkPhone(input) {
		var rex =  /^\+?([0-9]{2})\)?[-.]?([0-9]{4})[-.]?([0-9]{4})$/.test(input);
		return rex
	},

	checkPassword(password) {
		return facade(passwordConstraints, password);
	},

	checkConfirmPassword(password, confirmPassword) {
		return password === confirmPassword ? undefined : I18n.t("resetPasswordViaEmail.doNotMatch");
	},

	checkEmptyField(input) {
		return input.length <= 0;
	},

	trimValue(value) {
		return value.replace(/^\s+|\s+$/g, "");
	}
};

/**
 * Use to shorten common validate code
 *
 * @param {string} input
 * @param {object} constraints
 * @returns undefined as true, string as false
 */
const facade = (constraints, input, input2 = undefined) => {
	let result;
	if (input2 !== undefined) result = validate({ foo: input, foo2: input2 }, constraints);
	else result = validate({ foo: input }, constraints);
	return result === undefined ? result : removeFirstWord(result.foo[0]);
};

/**
 * Because this lib return the field name in error string. I need to cut it out.
 *
 * @param {string} result
 * @returns result without headed error name
 */
const removeFirstWord = result => result.substr(result.indexOf(" ") + 1);

export default Validator;
