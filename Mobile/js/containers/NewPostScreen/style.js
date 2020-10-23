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

  postImages:{
    width: ScreenWidth,
      height: ScreenWidth,
    // margin: SPACINGS.small
    },
  avatar: {
    width: ScreenWidth * 0.1,
    height: ScreenWidth * 0.1,
	borderRadius: ScreenWidth * 0.6,
	marginRight: SPACINGS.avg
  },
  image: {
    width: ScreenWidth / 3,
    height: ScreenWidth / 3,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 20,
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
