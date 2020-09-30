import {StyleSheet} from 'react-native';
import {colors} from '../../shared/utils/colors/colors';
import {ScreenHeight, ScreenWidth} from '../../shared/utils/dimension/Divices';
import {SPACINGS, FONTSIZES} from '../../themes';
import fonts from '../../shared/utils/fonts/fonts'

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    paddingBottom: 120,
  },
  stepIndicator: {
    marginVertical: SPACINGS.avg,
    height: 60
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepLabel: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
    color: colors.gray_new,
  },
  stepLabelSelected: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
    color: colors.purpleMain,
  },
  field: {
    borderRadius: 30,
    paddingLeft: SPACINGS.large
  },
  genderButton: {
    borderRadius: 40,
    width: ScreenWidth * 0.25,
    borderWidth: 0,
    backgroundColor: colors.gray_bg,
    color: colors.black
  },
  selectedButton:{
    borderRadius: 40,
    width: ScreenWidth * 0.25,
    borderWidth: 1,
    borderColor: colors.purpleMain,
    color: colors.black,
  },
  plusButton:{
    borderRadius: 40,
    width: 50,
    color: colors.black,
  },
  applyButton:{
    borderRadius: 40,
    marginTop: SPACINGS.avg,
  },
  captureButton: {
    borderRadius: 40,
    marginTop: 10,
    display: "flex",
    flexDirection: "row-reverse",
  },
  cardTitle:{
    color: colors.black,
    textAlign: "center",
    fontSize: 18,
    textAlign: "center"
  },
  cardContent:{
    color: colors.gray_new,
    fontSize: 15
  }
});

export default {
  styles,
};
