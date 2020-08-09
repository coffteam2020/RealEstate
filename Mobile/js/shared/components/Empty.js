import React from 'react';
import PropTypes from 'prop-types';
import {colors} from '../utils/colors/colors';
import {View, StyleSheet} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LottieView from 'lottie-react-native';
import {ScreenWidth} from '../utils/dimension/Divices';
import TextNormal from './Text/TextNormal';

const Empty = ({message}) => {
	return (
		<View style={styles.content}>
			<Animatable.View animation="fadeIn" style={styles.container}>
				<LottieView
					autoPlay
					loop
					source={require('../../../assets/imgs/sleep.json')}
				/>
			</Animatable.View>
			<TextNormal style={styles.text} numberOfLines={10} text={message || 'No data available for now'}/>
		</View>
	);
};

export default Empty;

const styles = StyleSheet.create({ 
	content: { 
		alignContent: 'center', 
		alignItems: 'center', 
		alignSelf: 'center', 
		justifyContent: 'center' 
	},
	container: {
		borderRadius: 20, 
		width: ScreenWidth, 
		height: ScreenWidth, 
		alignContent: 'center', 
		alignItems: 'center', 
		alignSelf: 'center', 
		justifyContent: 'center'
	},
	text: {
		width: ScreenWidth * 0.8, 
		textAlign: 'center'
	}
});
