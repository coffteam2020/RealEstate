import React from 'react';
import PropTypes from 'prop-types';
import {colors} from '../utils/colors/colors';
import {View, StyleSheet} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LottieView from 'lottie-react-native';
import {ScreenWidth} from '../utils/dimension/Divices';

const Speaker = (style) => {
	return (
		<View style={styles.content}>
			<Animatable.View animation="fadeIn" style={[styles.container, style]}>
				<LottieView
					autoPlay
					loop
					source={require('../../../assets/imgs/pulse.json')}
				/>
			</Animatable.View>
		</View>
	);
};

export default Speaker;

const styles = StyleSheet.create({ 
	content: {
		width: '100%', 
		height: '100%', 
		position: 'absolute',
		alignContent: 'center', 
		alignItems: 'center', 
		alignSelf: 'center', 
		justifyContent: 'center' 
	},
	container: {
		width: ScreenWidth / 3, 
		height: ScreenWidth / 3, 
		alignContent: 'center', 
		alignItems: 'center', 
        alignSelf: 'center', 
        marginBottom: 20,
        zIndex: -10,
        justifyContent: 'center',
	}
});
