import React from 'react';
import PropTypes from 'prop-types';
import {colors} from '../utils/colors/colors';
import {View, StyleSheet} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LottieView from 'lottie-react-native';
import {ScreenWidth} from '../utils/dimension/Divices';
import TextNormal from './Text/TextNormal';

const Wave = ({style}) => {
	return (
		<View style={styles.content}>
			<Animatable.View animation="fadeIn" style={[styles.container, style]}>
				<LottieView
					autoPlay
					loop
					source={require('../../../assets/imgs/wave.json')}
				/>
			</Animatable.View>
		</View>
	);
};

export default Wave;

const styles = StyleSheet.create({ 
	content: { 
		alignContent: 'center', 
		alignItems: 'center', 
		alignSelf: 'center', 
		justifyContent: 'center' 
	},
	container: {
		width: ScreenWidth * 0.8, 
		height: ScreenWidth * 0.5, 
	},
	text: {
		width: ScreenWidth * 0.8, 
		textAlign: 'center'
	}
});
