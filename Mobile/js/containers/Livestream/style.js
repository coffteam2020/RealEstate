import {StyleSheet} from 'react-native';
import {colors} from '../../shared/utils/colors/colors';
import {
  ScreenHeight,
  ScreenWidth,
  safeTopHeight,
} from '../../shared/utils/dimension/Divices';
import {SPACINGS, FONTSIZES} from '../../themes';
import fonts from '../../shared/utils/fonts/fonts';

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'space-between',
  },
  listMessages: {
    height: 300,
  },
  separatorView: {
    marginLeft: SPACINGS.xxLarge,
    width: ScreenWidth - SPACINGS.xxLarge * 2,
    height: 1,
    backgroundColor: colors.borderColor,
  },
  content: {
    padding: SPACINGS.xLarge,
    paddingTop: SPACINGS.small,
    width: ScreenWidth,
    height: ScreenHeight,
  },
  fieldContainer: {
    width: ScreenWidth,
    paddingEnd: 20,
    paddingLeft: 20,
    height: ScreenHeight,
  },
  fieldLoginSocial: {
    marginBottom: SPACINGS.large,
    fontFamily: fonts.family.nunito.light,
    textAlign: 'center',
  },
  img: {
    marginLeft: SPACINGS.avg,
    width: ScreenWidth / 3,
    height: ScreenWidth / 3,
  },
  fieldItem: {
    marginBottom: SPACINGS.xxxLarge,
  },
  signUp: {
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
  },
  signUpTitle: {
    color: colors.blue_dodger,
    fontFamily: fonts.family.nunito.regular,
    fontSize: FONTSIZES.default,
    marginTop: SPACINGS.avg,
  },
  signUpTitleDefault: {
    marginTop: SPACINGS.avg,
  },
  signUpMotto: {
    fontFamily: fonts.family.nunito.semiBold,
    fontSize: FONTSIZES.default,
    marginTop: SPACINGS.avg,
  },
  footerContainer: {
    alignItems: 'center',
    width: ScreenWidth - SPACINGS.xxLarge * 2,
    height: ScreenHeight / 4 + SPACINGS.xxLarge,
    marginTop: SPACINGS.avg,
  },
  socialContainer: {
    margin: SPACINGS.default,
    width: ScreenWidth - SPACINGS.xLarge * 2,
  },
  fieldItemTop: {
    marginTop: SPACINGS.xLarge,
  },
  container: {
    marginTop: SPACINGS.xxLarge,
    height: ScreenHeight,
  },
  underlineStyleBase: {
    width: 40,
    height: 45,
    borderWidth: 0,
    fontSize: 20,
    color: colors.black,
    borderBottomWidth: 2,
    borderColor: '#E8006F',
  },
  underlineStyleHighLighted: {
    borderColor: '#E8006F',
  },
  motto: {
    marginBottom: SPACINGS.xxxLarge,
    fontFamily: fonts.family.nunito.bold,
    textAlign: 'center',
  },
  mottoEmail: {
    marginBottom: SPACINGS.xxxLarge,
    fontSize: FONTSIZES.default,
    fontFamily: fonts.family.nunito.regular,
  },
  login: {
    color: colors.blue_dodger,
  },
  button: {
    marginTop: SPACINGS.large,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  item: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    width: ScreenWidth / 2,
    marginBottom: 10,
  },
  count: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 15,
    position: 'absolute',
    top: 10,
    left: 18,
    paddingEnd: 10,
    paddingLeft: 10,
    height: 25,
  },
  rate: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 5,
    position: 'absolute',
    top: 10,
    right: 18,
    paddingEnd: 5,
    paddingLeft: 5,
    height: 25,
  },
  id: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 5,
    position: 'absolute',
    bottom: 5,
    right: 10,
    paddingEnd: 5,
    paddingLeft: 5,
    height: 25,
  },
  end: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 15,
    position: 'absolute',
    top: 10,
    left: 18,
    paddingEnd: 10,
    paddingLeft: 10,
    height: 25,
  },
  livestreamItem: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 10,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    alignContent: 'flex-start',
    height: (ScreenWidth - 30) / 2,
    width: (ScreenWidth - 30) / 2,
    borderRadius: 15,
    position: 'absolute',
    top: 0,
    left: 8,
  },
});

export default {
  styles,
};
