/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { colors } from '../../utils/colors/colors';
import { RADIUS, SPACINGS } from '../../../themes';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ScreenWidth, ScreenHeight } from '../../utils/dimension/Divices';
import { containerStyle } from '../../../themes/styles';
import { useTranslation } from 'react-i18next';
import Modal from 'react-native-modal';
import FastImage from 'react-native-fast-image';
import Constant from '../../utils/constant/Constant';
import Close from '../Icons/Close';
import AntDesign from "react-native-vector-icons/AntDesign";
import { useStores } from '../../../store/useStore';
import ImageZoom from 'react-native-image-pan-zoom';

const ModalImage = ({ isVisible, uri }) => {
    const { homeStore } = useStores();
    return (
        <Modal isVisible={isVisible} animationIn="fadeIn" animationOut="fadeOut" animationInTiming={800} animationOutTiming={1000}>
            <View style={[styles.container, containerStyle.shadow]}>
                <ImageZoom
                    style={styles.container}
                    cropWidth={ScreenWidth * 0.9}
                    cropHeight={ScreenWidth * 0.9}
                    imageWidth={ScreenWidth * 0.9}
                    imageHeight={ScreenWidth * 0.9}>
                    <FastImage
                        style={[styles.container]}
                        source={{
                            uri: uri && uri != "" ? uri : Constant.MOCKING_DATA.NO_IMG_PLACE_HOLDER,
                            priority: FastImage.priority.high,
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                    />
                </ImageZoom>
                <TouchableOpacity onPress={() => homeStore.setShowImageZoom(false)} style={styles.close}>
                    <AntDesign name="closecircle" size={25} color={colors.black} />
                </TouchableOpacity>
            </View>
        </Modal>
    );
};


export default ModalImage;

const styles = StyleSheet.create({
    container: {
        borderRadius: RADIUS.backIco,
        width: ScreenWidth * 0.9,
        height: ScreenWidth * 0.9,
        backgroundColor: colors.blackBackground,
        alignContent: "center",
        alignSelf: 'center'
    },
    img: {
        width: ScreenWidth * 0.8,
        height: ScreenWidth * 0.8,
    },
    close: {
        position: "absolute",
        top: SPACINGS.small,
        right: SPACINGS.small,
        backgroundColor: colors.white,
        width: 25,
        height: 25,
        borderRadius: 12.5
    }
})