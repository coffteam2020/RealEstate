import {StyleSheet} from 'react-native';
import {colors} from '../../shared/utils/colors/colors';
import {ScreenHeight, ScreenWidth} from '../../shared/utils/dimension/Divices';
import {SPACINGS} from '../../themes';

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
  },
  location: {
    height: ScreenHeight / 2,
    width: ScreenWidth,
  },
  img: {
    marginLeft: SPACINGS.avg,
    width: ScreenWidth / 3,
    height: ScreenWidth / 3,
  },
  fieldEmailPhone: {
    borderRadius: 30,
  },
  search: {
    flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  avatar: {
    width: ScreenWidth * 0.2,
    height: ScreenWidth * 0.2,
    borderRadius: ScreenWidth * 0.5,
    marginRight: 20,
  },
  item: {
    marginStart: 20,
    marginEnd: 20,
    flexDirection: 'row',
  },
  gender: {
    flexDirection: 'row',
  },
  line: {
    height: 1,
    width: '100%',
    backgroundColor: colors.gray_bg,
  },
});

export default {
  styles,
};
