import React, {Component} from 'react';
import {Image,
	TextInput,
	TouchableWithoutFeedback,
	View,
	Text} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/AntDesign';

import Country from './country';
import Flags from './resources/flags';
import PhoneNumber from './phoneNumber';
import styles from './styles';
import CountryPicker from './countryPicker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {colors} from '../../../utils/colors/colors';
import {ScreenWidth} from '../../../utils/dimension/Divices';

export default class PhoneInput extends Component {
	static setCustomCountriesData(json) {
		Country.setCustomCountriesData(json);
	}

	constructor(props, context) {
		super(props, context);

		this.onChangePhoneNumber = this.onChangePhoneNumber.bind(this);
		this.onPressFlag = this.onPressFlag.bind(this);
		this.selectCountry = this.selectCountry.bind(this);
		this.getFlag = this.getFlag.bind(this);
		this.getISOCode = this.getISOCode.bind(this);

		const {countriesList, disabled, initialCountry} = this.props;

		if (countriesList) {
			Country.setCustomCountriesData(countriesList);
		}
		const countryData = PhoneNumber.getCountryDataByCode(initialCountry);

		this.state = {
			iso2: initialCountry,
			disabled,
			dialCode: countryData ? `+${countryData.dialCode}` : '',
			formattedNumber: countryData ? `+${countryData.dialCode}` : '',
			value: null
		};
	}

	componentWillMount() {
		if (this.props.value) {
			this.updateFlagAndFormatNumber(this.props.value);
		}
	}

	componentWillReceiveProps(nextProps) {
		const {value, disabled} = nextProps;
		this.setState({disabled});

		if (value && value !== this.state.value) {
			this.setState({value});
			this.updateFlagAndFormatNumber(value);
		}
	}

	onChangePhoneNumber(number) {
		const actionAfterSetState = this.props.onChangePhoneNumber
			? () => {
				this.props.onChangePhoneNumber(number);
			}
			: null;
		this.updateFlagAndFormatNumber(number, actionAfterSetState);
	}

	onPressFlag() {
		if (this.props.onPressFlag) {
			this.props.onPressFlag();
		} else {
			if (this.state.iso2) this.picker.selectCountry(this.state.iso2);
			this.picker.show();
		}
	}

	getPickerData() {
		return PhoneNumber.getAllCountries().map((country, index) => ({
			key: index,
			image: Flags.get(country.iso2),
			label: country.name,
			dialCode: `+${country.dialCode}`,
			iso2: country.iso2
		}));
	}

	getCountryCode() {
		const countryData = PhoneNumber.getCountryDataByCode(this.state.iso2);
		return countryData.dialCode;
	}

	getAllCountries() {
		return PhoneNumber.getAllCountries();
	}

	getFlag(iso2) {
		return Flags.get(iso2);
	}

	getDialCode() {
		return PhoneNumber.getDialCode(this.state.formattedNumber);
	}

	getValue() {
		return this.state.formattedNumber;
	}

	getNumberType() {
		return PhoneNumber.getNumberType(
			this.state.formattedNumber,
			this.state.iso2
		);
	}

	getISOCode() {
		return this.state.iso2;
	}

	selectCountry(iso2) {
		if (this.state.iso2 !== iso2) {
			const countryData = PhoneNumber.getCountryDataByCode(iso2);
			if (countryData) {
				this.setState(
					{
						iso2,
						dialCode: `+${countryData.dialCode}`,
						formattedNumber: `+${countryData.dialCode}`
					},
					() => {
						if (this.props.onSelectCountry) this.props.onSelectCountry(iso2);
					}
				);
			}
		}
	}

	isValidNumber() {
		return PhoneNumber.isValidNumber(
			this.state.formattedNumber,
			this.state.iso2
		);
	}

	format(text) {
		return this.props.autoFormat
			? PhoneNumber.format(text, this.state.iso2)
			: text;
	}

	updateFlagAndFormatNumber(number, actionAfterSetState = null) {
		const {allowZeroAfterCountryCode, initialCountry} = this.props;
		let iso2 = initialCountry;
		let phoneNumber = number;

		if (number) {
			if (phoneNumber[0] !== '+') phoneNumber = `+${phoneNumber}`;
			phoneNumber = allowZeroAfterCountryCode
				? phoneNumber
				: this.possiblyEliminateZeroAfterCountryCode(phoneNumber);
			iso2 = PhoneNumber.getCountryCodeOfNumber(phoneNumber);
		}
		this.setState(
			{iso2, formattedNumber: this.format(phoneNumber)},
			actionAfterSetState
		);
	}

	possiblyEliminateZeroAfterCountryCode(number) {
		const dialCode = PhoneNumber.getDialCode(number);
		return number.startsWith(`${dialCode}0`)
			? dialCode + number.substr(dialCode.length + 1)
			: number;
	}

	focus() {
		this.inputPhone.focus();
	}

	blur() {
		this.inputPhone.blur();
	}

	render() {
		const {iso2, formattedNumber, disabled} = this.state;
		const TextComponent = this.props.textComponent || TextInput;
		return (
			<View style={[styles.container, this.props.style]}>
				<View style={[styles.countryContainer, this.props.countryContainerStyle]}>
					<TouchableWithoutFeedback
						onPress={this.onPressFlag}
						disabled={disabled}
					>
						<View style={{borderColor: this.props.borderColor, borderWidth: 0.5, backgroundColor: this.props.backgroundColor || colors.blackInput, paddingEnd: 10, paddingLeft: 10, borderRadius: 6, height: 48, flexDirection: 'row', justifyContent: 'center', alignContent: 'center', alignItems: 'center', alignSelf: 'center'}}>
							<Image
								source={Flags.get(iso2)}
								style={[styles.flag, this.props.flagStyle]}
								onPress={this.onPressFlag}
							/>
							<Ionicons name="ios-arrow-down" size={22} color={colors.blue_dodger} />
						</View>
					</TouchableWithoutFeedback>
				</View>

				<View
					style={[
						styles.phoneContainer,
						{
							flex: 1,
							width: ScreenWidth * 0.7,
							marginLeft: this.props.offset || 10
						},
						this.props.phoneContainerStyle
					]}
				>
					<View style={{borderColor: this.props.borderColor, borderWidth: 0.5, backgroundColor: this.props.backgroundColor || colors.blackInput, paddingEnd: 10, paddingLeft: 10, borderRadius: 6, height: 48, flexDirection: 'row', justifyContent: 'center', alignContent: 'center', alignItems: 'center', alignSelf: 'center'}}>
						<TextComponent
							ref={ref => {
								this.inputPhone = ref;
							}}
							editable={!disabled}
							autoCorrect={false}
							style={[styles.text, this.props.textStyle]}
							onChangeText={text => {
								this.onChangePhoneNumber(text);
								this.props.onChangeText(text);
							}}
							keyboardType={'number-pad'} 
							underlineColorAndroid="rgba(0,0,0,0)"
							value={formattedNumber}
							returnKeyType="done"
							{...this.props.textProps}
						/>
					</View>
				</View>

				<CountryPicker
					ref={ref => {
						this.picker = ref;
					}}
					selectedCountry={iso2}
					onSubmit={this.selectCountry}
					buttonColor={this.props.pickerButtonColor}
					buttonTextStyle={this.props.pickerButtonTextStyle}
					cancelText={this.props.cancelText}
					cancelTextStyle={this.props.cancelTextStyle}
					confirmText={this.props.confirmText}
					confirmTextStyle={this.props.confirmTextStyle}
					pickerBackgroundColor={this.props.pickerBackgroundColor}
					itemStyle={this.props.pickerItemStyle}
					onPressCancel={this.props.onPressCancel}
					onPressConfirm={this.props.onPressConfirm}
				/>
			</View >
		);
	}
}

const styleType = PropTypes.oneOfType([PropTypes.object, PropTypes.number]);

PhoneInput.propTypes = {
	textComponent: PropTypes.func,
	initialCountry: PropTypes.string,
	onChangePhoneNumber: PropTypes.func,
	value: PropTypes.string,
	style: styleType,
	flagStyle: styleType,
	textStyle: styleType,
	offset: PropTypes.number,
	textProps: PropTypes.object,
	onSelectCountry: PropTypes.func,
	onPressCancel: PropTypes.func,
	onPressConfirm: PropTypes.func,
	pickerButtonColor: PropTypes.string,
	pickerBackgroundColor: PropTypes.string,
	pickerItemStyle: styleType,
	countriesList: PropTypes.arrayOf(
		PropTypes.shape({
			name: PropTypes.string,
			iso2: PropTypes.string,
			dialCode: PropTypes.string,
			priority: PropTypes.number,
			areaCodes: PropTypes.arrayOf(PropTypes.string)
		})
	),
	cancelText: PropTypes.string,
	cancelTextStyle: styleType,
	confirmText: PropTypes.string,
	confirmTextTextStyle: styleType,
	disabled: PropTypes.bool,
	allowZeroAfterCountryCode: PropTypes.bool
};

PhoneInput.defaultProps = {
	initialCountry: 'us',
	disabled: false,
	allowZeroAfterCountryCode: true
};
