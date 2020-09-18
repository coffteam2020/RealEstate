/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  Animated,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import PropTypes from 'prop-types';
import fonts from '../../utils/fonts/fonts';
import {colors} from '../../utils/colors/colors';
import {SPACINGS, FONTSIZES, SIZES, RADIUS} from '../../../themes';
import TextNormal from '../Text/TextNormal';
import * as Animatable from 'react-native-animatable';
import CheckBox from '@react-native-community/checkbox';

const TextInputFlatWithRightCheckbox = ({
  disabled = false,
  value,
  returnKeyType,
  props,
  multiline,
  placeholder,
  hideText,
  onBlur,
  style,
  textInputStyle,
  onChangeText,
  text,
  hasRightIco,
  ico,
  secureText,
  icoDisabled,
  onPressIco,
  keyboardType,
  hasCheckbox,
}) => {
  const [focusing, setIsFocus] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if(disabled){
      setChecked(false);
    }
  }, [disabled])
  const {colorsApp} = props?.theme;
  if (value) { 
    return (
      <Animatable.View animation="flipInX" style={[styles.container, style]}>
        {hideText && hideText ? null : <TextNormal props={props} text={text} />}
        <View style={styles.containerInput}>
          <TextInput
            editable={!(disabled || !checked)}
            placeholder={placeholder || ''}
            placeholderTextColor={colorsApp.textColor || colors.white}
            style={[
              styles.default,
              {
                backgroundColor:
                  disabled || !checked
                    ? colorsApp.backgroundInput
                    : colors.backgroundInput,
                color: colorsApp.textColor || colors.black,
                borderColor: focusing ? colorsApp.main : colorsApp.borderColor,
                paddingEnd: SPACINGS.xxxLarge,
                paddingTop: SPACINGS.sSmall,
              },
              textInputStyle,
            ]}
            returnKeyType={returnKeyType || 'done'}
            value={value}
            numberOfLines={multiline && multiline ? 100 : 1}
            multiline={(multiline && multiline) || false}
            selectionColor={colorsApp.textColor}
            onFocus={() => {
              setIsFocus(true);
            }}
            onSubmitEditing={onBlur ? onBlur : () => {}}
            onKeyPress={onBlur ? onBlur : () => {}}
            keyboardType={(keyboardType && keyboardType) || 'default'}
            onChangeText={onChangeText}
            secureTextEntry={secureText}
            onBlur={() => {
              setIsFocus(false);
            }}
          />
          {hasCheckbox && hasCheckbox ? (
            <TouchableOpacity
              onPress={() => {
                if (!disabled) {
                  setChecked(!checked);
                }
              }}
              >
              <CheckBox
                boxType="square"
                disabled={disabled}
                onCheckColor={colors.purpleMain}
                onTintColor={colors.purpleMain}
                value={checked}
                style={{height: 20}}
                onValueChange={(newvalue) => {
                  setChecked(newvalue);
                }}
              />
              <TextNormal text={'Free'}></TextNormal>
            </TouchableOpacity>
          ) : null}
        </View>
      </Animatable.View>
    );
  } else {
    return (
      <Animatable.View animation="flipInX" style={[styles.container, style]}>
        {hideText && hideText ? null : <TextNormal props={props} text={text} />}
        <View style={styles.containerInput}>
          <TextInput
            editable={!disabled && !checked}
            placeholder={placeholder || ''}
            placeholderTextColor={colorsApp.white || colors.white}
            style={[
              styles.default,
              {
                backgroundColor:
                  disabled || checked
                    ? colors.backgroundInput
                    : colorsApp.backgroundInput,
                color: colorsApp.textColor || colors.black,
                borderColor: focusing ? colorsApp.main : colorsApp.borderColor,
                paddingEnd: SPACINGS.xxxLarge,
                paddingTop: SPACINGS.sSmall,
                flex: 1,
              },
              textInputStyle,
            ]}
            returnKeyType={returnKeyType || 'done'}
            selectionColor={colorsApp.textColor}
            onFocus={() => {
              setIsFocus(true);
            }}
            numberOfLines={multiline && multiline ? 100 : 1}
            multiline={(multiline && multiline) || false}
            onSubmitEditing={onBlur ? onBlur : () => {}}
            onKeyPress={onBlur ? onBlur : () => {}}
            keyboardType={(keyboardType && keyboardType) || 'default'}
            onChangeText={onChangeText}
            secureTextEntry={secureText}
            onBlur={() => {
              setIsFocus(false);
            }}
          />
          {hasCheckbox && hasCheckbox ? (
            <TouchableOpacity
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                margin: SPACINGS.avg,
              }}
              onPress={() => {
                if(!disabled)
                setChecked(!checked);
              }}
              >
              <CheckBox
                disabled={disabled}
                boxType="square"
                onCheckColor={colors.purpleMain}
                onTintColor={colors.purpleMain}
                value={checked}
                style={{height: 20}}
                onValueChange={(newvalue) => {
                  setChecked(newvalue);
                }}
              />
              <TextNormal text={'Free'}></TextNormal>
            </TouchableOpacity>
          ) : null}
        </View>
      </Animatable.View>
    );
  }
};

export default TextInputFlatWithRightCheckbox;

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACINGS.avg,
  },
  containerInput: {
    width: SIZES.textInput.width,
    height: SIZES.textInput.height,
    display: "flex",
    flexDirection: "row"
  },
  rightIcon: {
    position: 'absolute',
    right: SPACINGS.large,
    top: SIZES.textInput.height / 2 - 12,
  },
  default: {
    height: SIZES.textInput.height,
    color: colors.textColor || colors.black,
    borderRadius: RADIUS.default,
    fontSize: FONTSIZES.avg,
    letterSpacing: 0.5,
    borderWidth: 0.2,
    marginTop: SPACINGS.sSmall,
    fontFamily: fonts.family.nunito.regular,
    paddingLeft: SPACINGS.small,
  },
  readOnlyInput: {
    backgroundColor: colors.backgroundInput
  }
});
