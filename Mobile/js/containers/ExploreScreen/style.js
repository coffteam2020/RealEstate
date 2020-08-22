import {StyleSheet} from 'react-native';
import {ScreenWidth, ScreenHeight} from '../../shared/utils/dimension/Divices';
import {colors} from '../../shared/utils/colors/colors';

export const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    alignItems: 'center',
  },
  slide1: {
    width: ScreenWidth,
    height: ScreenHeight * 0.25,
    borderRadius: 0,
  },
  slide2: {
    width: ScreenWidth * 0.9,
    alignSelf: 'center',
    height: ScreenWidth * 0.25,
    borderRadius: 20,
    marginEnd: 20,
    marginBottom: 10,
    overflow: 'hidden',
  },
  swipe: {
    height: ScreenWidth * 0.25,
  },
  search: {
    marginTop: -40,
  },
  banner: {
    backgroundColor: colors.whiteBackground,
    flexDirection: 'row',
    borderRadius: 20,
    marginTop: 10,
    width: '90%',
    justifyContent: 'space-between',
    paddingTop: 20,
    alignContent: 'center',
    alignItems: 'center',
    paddingEnd: 10,
    paddingLeft: 10,
    paddingBottom: 10,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    alignContent: 'center',
    height: 80,
  },
  buttonText: {
    width: ScreenWidth / 4 - 40,
    textAlign: 'center',
    fontSize: 12,
  },
});

export default {
  styles,
};
