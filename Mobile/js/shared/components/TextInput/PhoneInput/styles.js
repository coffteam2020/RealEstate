import {StyleSheet, Dimensions} from 'react-native';
import {colors} from '../../../utils/colors/colors';
import fonts from '../../../utils/fonts/fonts';
import {ScreenWidth} from '../../../utils/dimension/Divices';

const {width} = Dimensions.get('window');

const SCREEN_WIDTH = width;

export default StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'stretch',
		justifyContent: 'center'
		// borderWidth:1,
	},
	basicContainer: {
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center'
	},
	modalContainer: {
		width: SCREEN_WIDTH,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 0
	},
	buttonView: {
		width: SCREEN_WIDTH,
		padding: 8,
		borderTopWidth: 0.5,
		borderTopColor: 'lightgrey',
		justifyContent: 'space-between',
		flexDirection: 'row'
	},
	bottomPicker: {
		width: SCREEN_WIDTH
	},
	flag: {
		height: 25,
		width: 38,
		borderRadius: 4,
		marginEnd: 10,
		borderWidth: 0.5,
		borderColor: '#cecece',
		backgroundColor: '#cecece'
	},
	flagWrap: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	bottomLine: {
		borderBottomWidth: 1,
		borderBottomColor: '#F50957',
		paddingBottom: 8
	},
	label: {
		fontFamily: fonts.family.nunito.bold,
		fontSize: 16,
		color: colors.white,
		letterSpacing: 0.32,
		alignContent: 'center',
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'center',
		textAlign: 'center'
	},
	text: {
		height: 38,
		padding: 0,
		marginTop: 5,
		fontFamily: fonts.family.nunito.bold,
		fontSize: 16,
		color: colors.white,
		width: ScreenWidth * 0.63,
		flex: 1,
		justifyContent: 'flex-start',
		alignSelf: 'flex-start'
	},
	countryContainer: {
		paddingBottom: 5,
		paddingTop: 5,
	},
	phoneContainer: {
		paddingTop: 5,
		paddingBottom: 5,
	}
});
