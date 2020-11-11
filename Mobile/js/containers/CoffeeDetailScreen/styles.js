import { Platform, StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../shared/utils/colors/colors';
import { safeTopHeight, ScreenWidth } from '../../shared/utils/dimension/Divices';
import fonts from '../../shared/utils/fonts/fonts';
import { FONTSIZES, RADIUS, SPACINGS } from '../../themes';

export const styles = StyleSheet.create({
  content: {
    flex: 1,
    // backgroundColor: colors.whiteTransparent,
  },
  imageBanner: {
    width: '100%',
    height: 200
  },
  contentInfo: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 20
  },
  txtNameStore: {
    fontSize: 18,
    fontWeight: '600'
  },
  txtAddressStore: {
    fontSize: 16,
    fontWeight: '600',
    color: 'gray',
    marginVertical: 10
  },
  itemMenu: {
    flexDirection: 'row',
    borderWidth: 0.5,
    borderColor: '#e5e5e5',
    marginBottom: 10,
    width: 180,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9c9eb9',
    paddingVertical: 5
  },
  txtItemMenu:{
    fontWeight: '600',
    color: '#fff'
  },
  rows:{
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatarStyle:{
    width: 80,
    height: 80,
    borderRadius: 100
  },
  marginRight:{
    marginRight: 10
  }
});

export default { styles };

const { width } = Dimensions.get('window');
