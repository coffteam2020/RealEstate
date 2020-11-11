import { Platform, StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../shared/utils/colors/colors';
import { safeTopHeight, ScreenWidth } from '../../shared/utils/dimension/Divices';
import fonts from '../../shared/utils/fonts/fonts';
import { FONTSIZES, RADIUS, SPACINGS } from '../../themes';

export const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: colors.whiteTransparent,
  },
  itemCoffee: {
    width: '90%',
    alignSelf: 'center',
    marginBottom: 10,
    shadowColor: "#000",
    flexDirection: 'row',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 0.1,
    elevation: 1,
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderWidth: 0.5,
    borderColor: '#e1ddeb'
  },
  avatarCoffee: {
    width: '30%',
    overflow: 'hidden'
  },
  itemChildren: {
    marginLeft: 20,
    width: '100%'
  },
  itemName: {
    fontSize: 20,
    color: 'black'
  },
  itemAddress: {
    color: 'gray',
    marginVertical: 5
  },
  itemPrice: {
    color: '#6436c7',
    marginTop: 5
  },
  fieldEmailPhone: {
    borderRadius: RADIUS.input,
    paddingLeft: SPACINGS.xLarge,
  },
  textInputStyle: {
    borderRadius: RADIUS.input,
    paddingLeft: SPACINGS.xLarge,
    borderWidth: 0.5,
    width: '86%',
    alignSelf: 'center',
    borderColor: '#e1ddeb',
    marginTop: 10
  },
  groupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    alignSelf: 'center',
    width: '100%',
    marginTop: 20
  },
  btnCancel: {
    width: 120,
    height: 46,
    borderWidth: 0.5,
    borderColor: '#e1ddeb',
    borderRadius: 25,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnAdd: {
    width: 120,
    height: 46,
    borderRadius: 25,
    backgroundColor: '#cdc3e6',
    alignItems: 'center',
    justifyContent: 'center'
  },
  txtBtnAdd: {
    color: '#fff',
    fontWeight: 'bold'
  },
  txtBtnCancel: {
    fontWeight: 'bold',
    color: '#000'
  },
  itemMenu: {
    borderWidth: 0.5,
    borderColor: '#e1ddeb',
    borderRadius: 25,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 5,
    paddingVertical: 5,
    marginRight: 5,
    marginBottom: 2
  },
  txtMenuItem: {
    fontSize: 8,
    color: 'gray'
  },
  txtMenuItemPrice: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#bdabeb'
  },
  viewUploadImage:{
    width: 150,
    height: 120,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderStyle: 'dashed',
    marginVertical: 10,
    alignSelf: 'center',
    borderRadius: 1
  },
  center:{
    alignItems: 'center',
    justifyContent: 'center'
  },
  txtUploadImage:{
    fontSize: 12,
    color: '#f68a20',
    marginTop: 5
  }
});

export default { styles };

const { width } = Dimensions.get('window');
