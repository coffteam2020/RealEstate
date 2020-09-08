import {StyleSheet} from 'react-native';
import {colors} from '../../shared/utils/colors/colors';
import {ScreenHeight, ScreenWidth} from '../../shared/utils/dimension/Divices';
import {SPACINGS} from '../../themes';
import { red } from 'react-native-redash';
import { color } from 'react-native-reanimated';

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
  },
  avatar: {
    width: ScreenWidth * 0.1,
    height: ScreenWidth * 0.1,
	borderRadius: ScreenWidth * 0.6,
	marginRight: SPACINGS.avg
  },
  image: {
    width: ScreenWidth / 2,
    height: ScreenWidth / 2,
    borderRadius: 10,
    backgroundColor: colors.red
  },
  parentContainer: {
    height: ScreenHeight,
    position: 'relative'
},
});

export default {
  styles,
};
