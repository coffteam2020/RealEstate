import React from 'react';
import PropTypes from 'prop-types';
import { colors } from '../utils/colors/colors';
import {View, StyleSheet} from "react-native";
import * as Animatable from "react-native-animatable";
import LottieView from "lottie-react-native";
import { ScreenWidth } from '../utils/dimension/Divices';

const CheckDone = () => {
    return (
        <View style={styles.content}>
            <Animatable.View animation="fadeIn" style={styles.container}>
                <LottieView
                    autoPlay
                    loop={false}
                    source={require('../../../assets/imgs/check.json')}
                />
            </Animatable.View>
        </View>
    );
};

export default CheckDone;

const styles = StyleSheet.create({ 
    content: {
        width: "100%", 
        height: "100%", 
        position: "absolute",
        alignContent: "center", 
        alignItems: "center", 
        alignSelf: "center", 
        justifyContent: "center" 
    },
    container: {
        shadowColor: "#000",
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
        borderRadius: 20, 
        width: ScreenWidth / 5, 
        height: ScreenWidth / 5, 
        alignContent: "center", 
        alignItems: "center", 
        alignSelf: "center", 
        justifyContent: "center"
    }
})
