import {StyleSheet} from 'react-native';
import {colors} from '../shared/utils/colors/colors';

export const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: colors.white,
    flex: 1,
  },
  itemContentContainer: {
    marginLeft: 10,
    marginRight: 10,
    paddingEnd: 30,
    flexDirection: 'column',
  },
  icon: {
    width: 40,
    height: 40,
  },
  iconInactive: {
    width: 20,
    height: 20,
  },
});

export default styles;
