import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../shared/utils/colors/colors';
import { ScreenHeight, ScreenWidth } from '../../shared/utils/dimension/Divices';
import { SPACINGS } from '../../themes';
import { red } from 'react-native-redash';
import { color } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    paddingBottom: 500,
  },

  postImages: {
    width: ScreenWidth,
    height: ScreenWidth,
    // margin: SPACINGS.small
  },
  avatar: {
    width: ScreenWidth * 0.1,
    height: ScreenWidth * 0.1,
    borderRadius: ScreenWidth * 0.6,
    marginRight: SPACINGS.avg
  },
  image: {
    width: ScreenWidth / 3,
    height: ScreenWidth / 3,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: colors.red
  },
  parentContainer: {
    height: ScreenHeight,
    position: 'relative'
  },
  titleModal: {
    color: '#000',
    elevation: 10,
    fontWeight: '500',
  },
  buttonModal: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginTop: 10,
    fontSize: 14,
    width: '100%',
  },
  menuModal: {
    color: '#000',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  viewModal: {
    width: width,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingBottom: 20,
    height: 150
  },
  viewImageFrom: {
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  btnAttach:{
    width: 100,
    height: 35,
    borderRadius: 8,
    backgroundColor: colors.black_lessy,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  txtBtnAttach: {
    fontSize: 18,
    color: '#fff'
  },
  iconPlus:{
    marginRight: 5
  }
});

export default {
  styles,
};
