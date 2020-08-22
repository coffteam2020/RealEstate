import {StyleSheet} from 'react-native';
import {colors} from '../../../shared/utils/colors/colors';
import {
  ScreenHeight,
  ScreenWidth,
} from '../../../shared/utils/dimension/Divices';
import {SPACINGS, FONTSIZES, SIZES, RADIUS} from '../../../themes';
import fonts from '../../../shared/utils/fonts/fonts';

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingTop: ScreenHeight / 10,
    width: ScreenWidth,
    alignItems: 'center',
    backgroundColor: colors.purpleMain,
    height: ScreenHeight,
  },
  motto: {
    fontSize: FONTSIZES.avg,
    fontFamily: fonts.family.nunito.semiBold,
    marginTop: SPACINGS.avg,
  },
  fieldContainer: {
    alignItems: 'center',
    width: ScreenWidth,
    height: ScreenHeight,
    backgroundColor: colors.whiteBackground,
    borderTopRightRadius: 20,
    zIndex: 1,
    borderTopLeftRadius: 25,
    marginTop: 50,
    paddingTop: 30,
  },
  fieldItem: {
    marginBottom: SPACINGS.xxxLarge,
  },
  fieldEmailPhone: {
    borderRadius: RADIUS.input,
    paddingLeft: SPACINGS.xLarge,
  },
  fieldPassword: {
    borderRadius: RADIUS.input,
    paddingLeft: SPACINGS.xLarge,
  },
  fieldForget: {
    marginTop: SPACINGS.xLarge,
    fontFamily: fonts.family.nunito.regular,
    paddingBottom: SPACINGS.xxxLarge,
    color: colors.gray_new,
  },
  fieldLoginSocial: {
    color: colors.whiteBackground,
    marginBottom: SPACINGS.large,
    fontFamily: fonts.family.nunito.light,
  },
  footerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 50,
    left: 0,
    width: ScreenWidth,
    backgroundColor: colors.whiteBackground,
  },
  socialContainer: {
    margin: SPACINGS.default,
    width: ScreenWidth,
    paddingHorizontal: 10,
  },
  social: {
    marginEnd: 5,
    height: 50,
    width: 50,
  },
  signUp: {
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
  },
  signUpTitle: {
    color: colors.purpleMain,
    fontFamily: fonts.family.nunito.bold,
    fontSize: FONTSIZES.default,
    marginTop: SPACINGS.avg,
  },
  signUpMotto: {
    fontFamily: fonts.family.nunito.light,
    fontSize: FONTSIZES.default,
    marginTop: SPACINGS.avg,
    color: colors.black,
  },
  img: {
    marginLeft: SPACINGS.avg,
    width: ScreenWidth / 5,
    height: ScreenWidth / 5,
  },
  signinButton: {
    borderRadius: 40,
    marginTop: 10,
  },
  statusBar: {
    backgroundColor: colors.red,
  },
});

export default {
  styles,
};
