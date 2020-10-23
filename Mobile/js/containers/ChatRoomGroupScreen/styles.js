import {Platform, StyleSheet} from 'react-native';
import {colors} from '../../shared/utils/colors/colors';
import {safeTopHeight, ScreenWidth} from '../../shared/utils/dimension/Divices';
import fonts from '../../shared/utils/fonts/fonts';
import {FONTSIZES, RADIUS, SPACINGS} from '../../themes';

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.whiteTransparent,
  },
  content: {
    paddingVertical: SPACINGS.xLarge,
    flex: 1,
    backgroundColor: colors.whiteTransparent,
  },
  topView: {
    position: 'absolute',
    height: Platform.OS == 'ios' ? 130 : 110,
    width: '100%',
    backgroundColor: colors.pinkBackground,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: safeTopHeight,
    marginBottom: SPACINGS.xxLarge,
    paddingHorizontal: SPACINGS.xxLarge,
  },
  listMessages: {
    marginTop: SPACINGS.xLarge,
  },
  textInputHeader: {
    paddingHorizontal: SPACINGS.xxLarge,
    width: ScreenWidth - SPACINGS.xxLarge * 2,
    height: 48,
    borderRadius: 2 * RADIUS.backIco,
    borderWidth: 0,
  },
  separatorView: {
    marginLeft: SPACINGS.xxLarge,
    width: ScreenWidth - SPACINGS.xxLarge * 2,
    height: 1,
    backgroundColor: colors.borderColor,
  },
  primaryInputToolBarStyle: {
    borderRadius: 14,
    borderWidth: 0,
    marginTop: 8,
    marginLeft: '20%',
    width: '75%',
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
  },
  textInputStyle: {
    paddingLeft: 10,
    marginLeft: 20,
    fontSize: 15,
    borderRadius: 14,
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'left',
    alignItems: 'center',
    alignSelf: 'center',
    height: '100%',
  },
  textSendStyle: {
    color: colors.black_lessy,
    fontSize: FONTSIZES.xSmall,
    fontFamily: fonts.family.nunito.regular,
    marginTop: 0,
  },
  avatarSendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 10,
    left: Platform.OS === 'ios' ? '-25%' : '3%',
    bottom: 0,
  },
});

export default {
  styles,
};
