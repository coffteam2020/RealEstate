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
    width: ScreenWidth * 0.25,
    display: 'flex',
    flexDirection: 'row-reverse',
  },
  slide1: {
    width: ScreenWidth,
    height: ScreenHeight * 0.25,
    borderRadius: 0,
  },
  detailContentWrapper: {
    width: ScreenWidth * 0.9,
    // padding: 20,
    paddingTop: 10,
    paddingBottom: 20,
    borderRadius: RADIUS.default,
    backgroundColor: colors.gray_bg_new,
  },
  detailContentMarginTopBottom: {
    marginTop: SPACINGS.avg,
    marginBottom: SPACINGS.avg
  },
  detailContent: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    // margin: SPACINGS.sSmall
  },
  buttonEitWrapper: {
    display: 'flex',
    flexDirection: 'row',
    width: '50%',
    justifyContent: 'center',
    alignContent: "center",
    alignItems: "center",
    borderRightColor: colors.gray_new,
    borderRightWidth: 1,
    margin: SPACINGS.avg,

  },
  buttonDeleteWrapper:{
    display: 'flex',
    flexDirection: 'row',
    width: '50%',
    justifyContent: 'center',
    alignContent: "center",
    alignItems: "center",
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
