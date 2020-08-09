import LogManager from "../utils/logging/LogManager";

export class ToastHelper {
	static TOAST_TYPES = {
		SUCCESS: 'success',
		ERROR: 'error',
		WARNING: 'warning',
		INFO: 'info',
	};
	static toasterDropDownAlert;
	static onClose;
	static onTap = () => {};

	static setToasterDropDown(dropDown) {
		this.toasterDropDownAlert = dropDown;
	}

	static show(type, message) {
		if (this.toasterDropDownAlert) {
			this.toasterDropDownAlert.alertWithType(type, "", message);
		}
	}

	static showSuccess(message) {
		if (this.toasterDropDownAlert) {
			this.toasterDropDownAlert.alertWithType(
				this.TOAST_TYPES.SUCCESS,
				"",
				message,
			);
		}
	}

	static showError(message) {
		if (this.toasterDropDownAlert) {
			this.toasterDropDownAlert.alertWithType(
				this.TOAST_TYPES.ERROR,
				"ok",
				message,
			);
		}
	}
	static showWarning(message) {
		if (this.toasterDropDownAlert) {
			this.toasterDropDownAlert.alertWithType(
				this.TOAST_TYPES.WARNING,
				"",
				message,
			);
		}
	}

	static setOnClose(onClose) {
		this.onClose = onClose;
	}

	static invokeOnClose() {
		if (typeof this.onClose === 'function') {
			this.onClose();
		}
	}

	static setOnTap(onTap) {
		this.onTap = onTap;
	}

	static invokeOnTap() {
		if (typeof this.onTap === 'function') {
			this.onTap();
		}
	}
}
