/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { colors } from '../../utils/colors/colors';
import { RADIUS, SPACINGS } from '../../../themes';
import { StyleSheet, View } from 'react-native';
import { ScreenWidth } from '../../utils/dimension/Divices';
import { containerStyle } from '../../../themes/styles';
import { useTranslation } from 'react-i18next';
import Modal from 'react-native-modal';
import TextNormal from '../Text/TextNormal';
import icons from '../../utils/icons/icons';
import GradientButton from '../Buttons/GradientButton';

const ModalConnection = ({ isVisible, onPress }) => {
    const { t } = useTranslation();
    return (
        <Modal isVisible={isVisible} animationIn="fadeIn" animationOut="fadeOut" animationInTiming={800} animationOutTiming={1000}>
            <View style={[styles.container, containerStyle.shadow]}>
                <View style={[{ height: ScreenWidth * 0.3 }, containerStyle.centerNotFlex]}>
                    <TextNormal text={t("connection.lost")} style={[containerStyle.textHeaderSmall, containerStyle.textCenter, containerStyle.largeTextMargin]} />
                    <TextNormal numberOfLines={3} text={t("connection.connection")} style={[containerStyle.textNormal, containerStyle.textCenter]} />
                </View>
                <View style={{ height: ScreenWidth * 0.5 }}>
                    <View style={[containerStyle.centerNotFlex, containerStyle.largeTextMargin, containerStyle.defaultMarginTop, containerStyle.defaultMarginBottom]}>
                        {icons.IC_NO_ENTRY}
                    </View>
                    <GradientButton onPress={onPress} text={t("common.gotIt")} style={[containerStyle.buttonHalf, containerStyle.buttonCenter]} />
                </View>
            </View>
        </Modal>
    );
};


export default ModalConnection;

const styles = StyleSheet.create({
    container: {
        borderRadius: RADIUS.backIco,
        width: ScreenWidth * 0.8,
        height: ScreenWidth * 0.8,
        padding: SPACINGS.default,
        backgroundColor: colors.whiteTransparent,
        alignContent: "center",
        alignSelf: 'center'
    }
})