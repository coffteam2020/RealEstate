import {StyleSheet} from 'react-native';
import {colors} from '../../shared/utils/colors/colors';
import {ScreenHeight, ScreenWidth} from '../../shared/utils/dimension/Divices';
import {SPACINGS} from '../../themes';
import { red } from 'react-native-redash';

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  content: {
	alignItems: 'center',
	paddingBottom: 50,
  },
  avatar: {
    width: ScreenWidth * 0.1,
    height: ScreenWidth * 0.1,
	borderRadius: ScreenWidth * 0.6,
	marginRight: SPACINGS.avg
  },
  toolbar:{
	  flexDirection: "row",
	  justifyContent: "flex-start",
	  width: ScreenWidth * 0.9
  }
});

export default {
  styles,
};
