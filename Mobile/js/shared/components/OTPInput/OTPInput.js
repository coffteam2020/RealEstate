import React, { Component } from 'react';
import { View, StyleSheet, TextInput, Text } from 'react-native';
import PropTypes from 'prop-types';
import fonts from '../../utils/fonts/fonts';
import Check from '../Icons/Check';
import { colors } from '../../utils/colors/colors';

class OTPInput extends Component {

    static propTypes = {
        value: PropTypes.string,
        onChange: PropTypes.func,
        otpLength: PropTypes.number,
        tintColor: PropTypes.string,
        offTintColor: PropTypes.string,
        containerStyle: PropTypes.object,
        cellStyle: PropTypes.object,
        defaultValue: PropTypes.string,
        editable: PropTypes.bool
    }

    static defaultProps = {
        onChange: () => null,
        otpLength: 6,
        tintColor: '#0EAD69',
        offTintColor: '#0EAD69',
        containerStyle: {},
        cellStyle: {}
    };

    textInput = null;

    state = {
        internalVal: this.props.value || this.props.defaultValue
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.hasOwnProperty('value') && nextProps.value !== this.state.internalVal) {
            this.setState({ internalVal: nextProps.value });
        }
    }

    componentDidMount() {
        this.focus();
    };

    handleChangeText = (val) => {
        const { onChange } = this.props;

        onChange(val);
        this.setState({ internalVal: val })
    };

    // public methods
    inputRef() {
        return this.textInput;
    }

    focus() {
        if (this.props.editable !== false) {
            this.inputRef().focus();
        }
    }

    blur() {
        this.inputRef().blur();
    }

    isFocused() {
        return this.inputRef().isFocused();
    }

    clear() {
        this.setState({ internalVal: '' })
    }

    render() {
        const {
            containerStyle,
            cellStyle,
            tintColor,
            offTintColor,
            otpLength,
            ...otherProps
        } = this.props;

        const { internalVal } = this.state;

        return (
            <View>
                <TextInput
                    ref={input => (this.textInput = input)}
                    onChangeText={(text) => {
                        this.handleChangeText(text)
                        this.props.onChangeText && this.props.onChangeText(text)
                    }}
                    style={{ width: 0, height: 0, borderRadius: 8 }}
                    value={internalVal}
                    minLength={otpLength}
                    maxLength={otpLength}
                    returnKeyType="done"
                    keyboardType="numeric"
                    {...otherProps}
                />
                <View style={[styles.container, containerStyle]}>
                    {Array(otpLength)
                        .fill()
                        .map((_, index) => (
                            <Text
                                key={index}
                                style={[
                                    styles.cell,
                                    { color: this.props.textColor ? this.props.textColor : "#000" },
                                    cellStyle,
                                    {
                                        borderColor:
                                            internalVal && index === internalVal.length ? tintColor : offTintColor
                                    }
                                ]}
                                onPress={() => this.textInput.focus()}
                            >
                                {internalVal && internalVal.length > index ? internalVal[index] : " "}
                            </Text>
                        ))}
                    {internalVal && internalVal.length == this.props.otpLength ?
                        <Check color={"#0EAD69"} /> : null}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cell: {
        // paddingVertical: 11,
        padding: 12,
        width: 48,
        height: 56,
        margin: 5,
        textAlign: 'center',
        alignSelf: "center",
        fontSize: 22,
        fontFamily: fonts.family.nunito.bold,
        borderWidth: 1.5,
        borderRadius: 12,
        borderColor: "#0EAD69"
    }
});

export default OTPInput;