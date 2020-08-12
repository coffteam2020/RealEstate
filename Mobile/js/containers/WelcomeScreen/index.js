/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {StatusBar, View, Image, ScrollView} from 'react-native';
import {styles} from './style';
import {images} from '../../../assets/index';
import {withTheme} from 'react-native-paper';
import TextNormal from '../../shared/components/Text/TextNormal';
import {FONTSIZES, SPACINGS} from '../../themes';
import {containerStyle} from '../../themes/styles';
import {NavigationService} from '../../navigation';
import Route, {ScreenNames} from '../../route/ScreenNames';
import {useTranslation} from 'react-i18next';
import Carousel, {Pagination} from 'react-native-snap-carousel';

import GradientBackground from '../../shared/components/GradientBackground';
import {ScreenHeight, ScreenWidth} from '../../shared/utils/dimension/Divices';
import icons from '../../shared/utils/icons/icons';
import FlatButton from '../../shared/components/Buttons/FlatButton';
import {textStyleDefault} from '../../themes/text';
import IALocalStorage from '../../shared/utils/storage/IALocalStorage';

const WelcomeScreen = (props) => {
	const {t} = useTranslation();
	const imgs = [
		{
			uri: images.welcome.one,
			motto: t('motto.first'),
			secondMotto: 'Meet, connect, chat and learn with friends all over the world, understand cultures and languages ​​through fly messages, audio channels and video streams',
		},
		{
			uri: images.welcome.one,
			motto: t('motto.second'),
			secondMotto: 'In modern society, the application to connect with friends has become familiar and as part of your daily life. We created this application with nostalgic and dreamy ideas. ',
		},
		{
			uri: images.welcome.one,
			motto: t('motto.third'),
			secondMotto: ' We bring radio - listen to the stories of friends. We offer video stream - livestream and room interaction. And other interesting features waiting for you to discover ',
		},
	];
	const {colorsApp} = props.theme;
	let carousel = useRef(undefined);
	const [index, setIndex] = useState(0);
	const [activeSlider, setActiveSlider] = useState(0);

	useEffect(() => {
	}, []);
	const _renderItemCal = ({item}) => {
		return (
			<View>
				<Image
					source={item.uri}
					style={{height: (ScreenHeight * 2) / 3, width: ScreenWidth}}
					resizeMethod="resize"
					resizeMode="cover"
				/>
			</View>
		);
	};
	const dot = () => {
		return <View style={[styles.dot]}/>;
	};
	const inActiveDot = () => {
		return <View style={[styles.inActiveDot]}/>;
	};

	return (
		<View style={[containerStyle.default]}>
			<StatusBar barStyle={colorsApp.statusBar}/>
			<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 100}}>
				<View style={{height: (ScreenHeight * 2) / 3, width: ScreenWidth}}>
					<Carousel
						ref={(c) => {
							carousel = c;
						}}
						data={imgs}
						renderItem={(item, index) => _renderItemCal(item, index)}
						sliderWidth={ScreenWidth}
						itemWidth={ScreenWidth}
						onSnapToItem={(index) => setActiveSlider(index)}
					/>
				</View>
				<View
					style={[containerStyle.paddingDefault, {height: ScreenHeight / 3}]}>
					<TextNormal
						text={imgs[activeSlider].motto}
						style={[containerStyle.textHeader]}
					/>
					<TextNormal
						text={imgs[activeSlider].secondMotto}
						style={[
							containerStyle.textContent,
							containerStyle.smallMarginTop,
						]}
						numberOfLines={10}
					/>
					<View
						style={[containerStyle.horContainer, {margin: SPACINGS.default}]}
					/>
					
				</View>
			</ScrollView>
			<View style={[containerStyle.horContainerWithCenter, containerStyle.defaultMarginTop,{width: '90%', position: 'absolute', bottom: 20, left: 20, zIndex: 10}]}>
				<View style={[containerStyle.horContainer, containerStyle.defaultMarginTop]}>
					{activeSlider === 0 ? dot() : inActiveDot()}
					{activeSlider === 1 ? dot() : inActiveDot()}
					{activeSlider === 2 ? dot() : inActiveDot()}
				</View>
				<TextNormal
					clickable
					onPress={async () => {
						if (activeSlider < 2) {
                                    carousel?.snapToItem?.(activeSlider + 1);
						} else {
							// await IALocalStorage.setTokenFirstTime(true);
							NavigationService.navigate(ScreenNames.LoginScreen);
						}
					}}
					style={[containerStyle.defaultMarginTop]}
					text={activeSlider < 2 ? t('common.continue') : t('common.done')}
				/>
			</View>
		</View>
	);
};

export default withTheme(WelcomeScreen);
