import { StyleSheet } from 'react-native';
import { colors } from '../../shared/utils/colors/colors';
import { ScreenHeight, ScreenWidth } from '../../shared/utils/dimension/Divices';
import { SPACINGS } from '../../themes';

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
  postImages: {
    width: ScreenWidth / 2 - 20,
    height: ScreenWidth / 2 - 20,
    marginLeft: 15
  },
  search: {
    flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  avatar: {
    width: ScreenWidth * 0.3,
    height: ScreenWidth * 0.3,
    borderRadius: ScreenWidth * 0.6,
  },
  item: {
    marginStart: 20,
    marginEnd: 20,
    flexDirection: 'row',
  },
  gender: {
    flexDirection: 'row',
  },
  line: {
    height: 1,
    width: '100%',
    backgroundColor: colors.gray_bg,
  },
  itemContainer: {
    width: ScreenWidth,
    padding: 10,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nestedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default {
  styles,
};
