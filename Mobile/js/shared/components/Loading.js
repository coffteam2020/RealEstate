import React from 'react';
import PropTypes from 'prop-types';
import {colors} from '../utils/colors/colors';
import {View, StyleSheet} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LottieView from 'lottie-react-native';
import {ScreenWidth} from '../utils/dimension/Divices';

const Loading = () => {
	return (
		<View style={styles.content}>
			<Animatable.View animation="fadeIn" style={styles.container}>
				<LottieView
					autoPlay
					loop
					source={require('../../../assets/imgs/loading.json')}
				/>
			</Animatable.View>
		</View>
	);
};

export default Loading;

const styles = StyleSheet.create({ 
	content: {
		width: '50%', 
		top: '50%', 
		position: 'absolute',
		alignContent: 'center', 
		alignItems: 'center', 
		alignSelf: 'center', 
		zIndex: 1000000,
		justifyContent: 'center' 
	},
	container: {
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5, 
		backgroundColor: colors.whiteTransparent, 
		borderColor: colors.gray_bg, 
		borderWidth: 0.5, 
		zIndex: 1000000,
		borderRadius: 20, 
		width: ScreenWidth / 5, 
		height: ScreenWidth / 5, 
		alignContent: 'center', 
		alignItems: 'center', 
		alignSelf: 'center', 
		justifyContent: 'center'
	}
});
