import React from 'react';
import PropTypes from 'prop-types';
import {colors} from '../utils/colors/colors';
import {View, StyleSheet} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LottieView from 'lottie-react-native';
import {ScreenWidth} from '../utils/dimension/Divices';
import TextNormal from './Text/TextNormal';

const NoImage = ({}) => {
	return (
		<View style={styles.content}>
			<Animatable.View animation="fadeIn" style={styles.container}>
				<LottieView
					autoPlay
					loop={false}
					source={require('../../../assets/imgs/no_image.json')}
				/>
			</Animatable.View>
		</View>
	);
};

export default NoImage;

const styles = StyleSheet.create({ 
	content: { 
		alignContent: 'center', 
	},
	container: {
		borderRadius: 20, 
		width: ScreenWidth/4, 
		height: ScreenWidth/4, 
	},
	text: {
		width: ScreenWidth * 0.8, 
		textAlign: 'center'
	}
});
