import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import Constant from '../utils/constant/Constant';

const GradientBackground = props => {
	return (
		<LinearGradient
			colors={[
				props.fromColor || Constant.COLOR_BACKGROUND_BTN[0],
				props.toColor || Constant.COLOR_BACKGROUND_BTN[1],
			]}
			start={{x: 0, y: 1}}
            end={{x: 1, y: 0}}
            angle={-90}
			{...props}
		/>
	);
};

GradientBackground.propTypes = {
	fromColor: PropTypes.string,
	toColor: PropTypes.string,
};

GradientBackground.defaultProps = {
};

export default GradientBackground;
