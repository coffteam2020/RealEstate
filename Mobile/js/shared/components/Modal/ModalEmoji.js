/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { colors } from '../../utils/colors/colors';
import { RADIUS, SPACINGS, SIZES } from '../../../themes';
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import { ScreenWidth, ScreenHeight } from '../../utils/dimension/Divices';
import { containerStyle } from '../../../themes/styles';
import { useTranslation } from 'react-i18next';
import Modal from 'react-native-modal';
import TextNormal from '../Text/TextNormal';
import icons from '../../utils/icons/icons';
import GradientButton from '../Buttons/GradientButton';
import TextInputFlatLeftIconTouchable from '../TextInput/TextInputFlatLeftIconTouchable';
import EvilIcons from "react-native-vector-icons/EvilIcons";

const MOCKEMOTIONALS = [
    "travel", "cooking", "cat", "hangout", "reading", "music", "busy", "watching", "hura"
]
const ModalEmoji = ({ isVisible, onBlur, props, onChangeText }) => {
    const { t } = useTranslation();
    const renderItem = (item) => {
        return (
            <TouchableOpacity onPress={() => {
                onChangeText(item);
                onBlur
            }} style={{ height: SIZES.button.height * 0.7 }}>
                <TextNormal text={t("emoji." + item.item)} />
            </TouchableOpacity>
        )
    }
    return (
        <Modal isVisible={isVisible} animationIn="fadeIn" animationOut="fadeOutRightBig" animationInTiming={800} animationOutTiming={1000}>
            <View style={[styles.container, containerStyle.shadow]}>
                <View style={[{ height: ScreenWidth * 0.3 }, containerStyle.centerNotFlex]}>
                    <TextInputFlatLeftIconTouchable
                        onChangeText={text => onChangeText(text)}
                        hideText
                        props={props}
                        onBlur={()=>onBlur()}
                        hasLeftIcon
                        ico={<EvilIcons name="pencil" size={30} color={props.theme.dark ? colors.white : colors.black} />}
                        style={containerStyle.textInputHeaderDefault}
                        textInputStyle={containerStyle.textInputHeaderDefault}
                    />
                    <TextNormal numberOfLines={3} text={t("home.whereYouDo")} style={[containerStyle.textNormal, containerStyle.defaultMarginTop]} />
                </View>
                <View style={{ flex: 1, padding: SPACINGS.avg }}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={MOCKEMOTIONALS}
                        key={(item, index) => item.toString()}
                        renderItem={item => renderItem(item)} />
                </View>
            </View>
        </Modal>
    );
};


export default ModalEmoji;

const styles = StyleSheet.create({
    container: {
        borderRadius: RADIUS.backIco,
        width: ScreenWidth * 0.8,
        height: ScreenHeight * 0.5,
        padding: SPACINGS.default,
        backgroundColor: colors.white,
        alignSelf: 'center'
    }
})