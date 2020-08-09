import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View,
	KeyboardAvoidingView,
	Modal,
	TouchableOpacity,
	Animated,
	Platform} from 'react-native';
import styles from './styles';

const SUPPORTED_ORIENTATIONS = [
	'portrait',
	'portrait-upside-down',
	'landscape',
	'landscape-left',
	'landscape-right'
];

class BottomSheet extends Component {
	constructor(props) {
		super(props);
		this.state = {
			modalVisible: false,
			animatedHeight: new Animated.Value(0),
			pan: new Animated.ValueXY()
		};
	}

	setModalVisible(visible) {
		const {height, minClosingHeight, duration, onClose} = this.props;
		const {animatedHeight, pan} = this.state;
		if (visible) {
			this.setState({modalVisible: visible});
			Animated.timing(animatedHeight, {
				toValue: height,
				duration
			}).start();
		} else {
			Animated.timing(animatedHeight, {
				toValue: minClosingHeight,
				duration
			}).start(() => {
				pan.setValue({x: 0, y: 0});
				this.setState({
					modalVisible: visible,
					animatedHeight: new Animated.Value(0)
				});

				if (typeof onClose === 'function') onClose();
			});
		}
	}

	open() {
		this.setModalVisible(true);
	}

	close() {
		this.setModalVisible(false);
	}

	render() {
		const {animationType,
			closeOnDragDown,
			closeOnPressMask,
			closeOnPressBack,
			children,
			customStyles} = this.props;
		const {animatedHeight, pan, modalVisible} = this.state;
		const panStyle = {
			transform: pan.getTranslateTransform()
		};

		return (
			<Modal
				transparent
				animationType={animationType}
				visible={modalVisible}
				supportedOrientations={SUPPORTED_ORIENTATIONS}
				onRequestClose={() => {
					if (closeOnPressBack) this.setModalVisible(false);
				}}
			>
				<KeyboardAvoidingView
					enabled={Platform.OS === 'ios'}
					behavior="padding"
					style={[styles.wrapper, customStyles.wrapper]}
				>
					<TouchableOpacity
						style={styles.mask}
						activeOpacity={1}
						onPress={() => (closeOnPressMask ? this.close() : null)}
					/>
					<Animated.View
						style={[panStyle, styles.container, {height: animatedHeight}, customStyles.container]}
					>
						{children}
					</Animated.View>
				</KeyboardAvoidingView>
			</Modal>
		);
	}
}

BottomSheet.propTypes = {
	animationType: PropTypes.oneOf(['none', 'slide', 'fade']),
	height: PropTypes.number,
	minClosingHeight: PropTypes.number,
	duration: PropTypes.number,
	closeOnDragDown: PropTypes.bool,
	closeOnPressMask: PropTypes.bool,
	closeOnPressBack: PropTypes.bool,
	customStyles: PropTypes.objectOf(PropTypes.object),
	onClose: PropTypes.func,
	children: PropTypes.node
};

BottomSheet.defaultProps = {
	animationType: 'none',
	height: 260,
	minClosingHeight: 0,
	duration: 300,
	closeOnDragDown: false,
	closeOnPressMask: true,
	closeOnPressBack: true,
	customStyles: {},
	onClose: null,
	children: <View />
};

export default BottomSheet;
