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
    width: '90%',
    justifyContent: 'space-between',
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
    height: 70,
  },
  btn2: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    width: ScreenWidth / 4 - 40,
    textAlign: 'center',
    fontSize: 12,
  },
  trendContainer: {
    alignItems: 'center',
    height: ScreenHeight * 0.3,
    flexDirection: 'row',
    width: ScreenWidth * 0.9,
    marginTop: 10,
  },
  img1: {
    width: ScreenWidth * 0.3,
    borderRadius: 20,
    alignItems: 'flex-end',
    height: ScreenHeight * 0.295,
    flex: 1,
    overflow: 'hidden',
  },
  shadownImg1: {
    height: ScreenHeight * 0.295,
    width: ScreenWidth * 0.3,
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingTop: 20,
    paddingEnd: 10,
    paddingLeft: 10,
    flex: 1,
    borderRadius: 20,
  },
  img2: {
    alignItems: 'flex-end',
    height: ScreenHeight * 0.12,
    marginBottom: 5,
    overflow: 'hidden',
    borderRadius: 20,
  },
  shadowImg2: {
    width: ScreenWidth * 0.6,
    height: ScreenHeight * 0.12,
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingTop: 20,
    paddingEnd: 10,
    alignItems: 'flex-end',
    borderRadius: 20,
  },
  img3: {
    height: ScreenHeight * 0.17,
    borderRadius: 20,
    overflow: 'hidden',
  },
  shadowImg3: {
    width: ScreenWidth * 0.6,
    height: ScreenHeight * 0.17,
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingTop: 20,
    paddingLeft: 20,
    alignItems: 'flex-start',
    borderRadius: 20,
  },
});

export default {
  styles,
};
