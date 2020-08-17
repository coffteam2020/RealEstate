import {StyleSheet} from 'react-native';
import {colors} from '../../shared/utils/colors/colors';
import {ScreenHeight, ScreenWidth} from '../../shared/utils/dimension/Divices';
import {SPACINGS, SIZES} from '../../themes';

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    width: ScreenWidth / 3,
    height: ScreenHeight,
  },
  img: {
    marginLeft: SPACINGS.avg,
    width: ScreenWidth / 3,
    height: ScreenWidth / 3,
  },
  pagination: {
    width: ScreenWidth / 4,
    alignSelf: 'center',
  },
  dot: {
    height: SIZES.dots.height,
	width: SIZES.dots.widthNormal,
	borderRadius: SIZES.dots.widthNormal / 2,
	backgroundColor: '#665AAA',
	marginEnd: 5,
  },
  inActiveDot: {
    height: SIZES.dots.height,
    width: SIZES.dots.width,
    borderRadius: SIZES.dots.width / 2,
	backgroundColor: '#665AAA',
	marginEnd: 5,
  },
  marginHorizontalEnd: {
    marginEnd: 5,
  },
  marginHorizontalLeft: {
    marginLeft: 5,
  },
  motto: {
    position: 'absolute',
    justifyContent: 'center',
    alignContent: 'center',
    bottom: SPACINGS.small,
    left: SPACINGS.xLarge,
    right: SPACINGS.xLarge,
    width: ScreenWidth - SPACINGS.xLarge,
    height: ScreenHeight / 10,
  },
});

export default {
  styles,
};
