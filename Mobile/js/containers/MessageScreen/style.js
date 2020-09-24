import {StyleSheet} from 'react-native';
import {colors} from '../../shared/utils/colors/colors';
import {SPACINGS, RADIUS} from '../../themes';
import {safeTopHeight, ScreenHeight, ScreenWidth} from '../../shared/utils/dimension/Divices';

export const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: colors.white,
  },
  content: {
    paddingVertical: SPACINGS.xLarge,
    flex: 1,
  },
  topView: {
    position: 'absolute',
    height: 150,
    width: '100%',
    backgroundColor: colors.gray_bg,
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
    height: '80%'
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
});

export default {
  styles,
};
