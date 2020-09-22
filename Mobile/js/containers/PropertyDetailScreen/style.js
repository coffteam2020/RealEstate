import {StyleSheet} from 'react-native';
import {colors} from '../../shared/utils/colors/colors';
import {ScreenHeight, ScreenWidth} from '../../shared/utils/dimension/Divices';
import {SPACINGS, FONTSIZES, RADIUS} from '../../themes';
import fonts from '../../shared/utils/fonts/fonts'

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    paddingBottom: 50,
  },
  stepIndicator: {
    marginVertical: SPACINGS.avg,
    height: 60,
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButton: {
    borderRadius: 40,
    marginTop: 10,
    width: ScreenWidth / 4,
    display: 'flex',
    flexDirection: 'row-reverse',
  },
  slide1: {
    width: ScreenWidth,
    height: ScreenHeight * 0.25,
    borderRadius: 0,
  },
  detailContentWrapper: {
    width: ScreenWidth * 0.8,
    borderRadius: RADIUS.default,
    backgroundColor: colors.gray_bg_new,
  },
  detailContent: {
    display: 'flex',
    flexDirection: 'row',
    margin: SPACINGS.avg
  },
  buttonEitWrapper: {
    display: 'flex',
    flexDirection: 'row',
    width: '50%',
    justifyContent: 'center',
    borderRightColor: colors.gray_new,
    borderRightWidth: 1,
    margin: SPACINGS.avg,
  },
  buttonDeleteWrapper:{
    display: 'flex',
    flexDirection: 'row',
    width: '50%',
    justifyContent: 'center',
    borderLeftColor: colors.gray_new,
    borderLeftWidth: 1,
    margin: SPACINGS.avg,
  },
  fieldHeader:{
    color: colors.gray_new
  },
  fieldValue:{
    color: colors.purpleMain,
    fontWeight: "bold"
  }
});

export default {
  styles,
};
