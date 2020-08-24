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
	paddingBottom: 50,
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
});

export default {
  styles,
};
