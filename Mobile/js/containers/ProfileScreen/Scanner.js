/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { StatusBar, View, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import { styles } from './style';
import { withTheme } from 'react-native-paper';
import { containerStyle } from '../../themes/styles';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native-gesture-handler';
import HeaderFull from '../../shared/components/Header/HeaderFull';
import { useObserver } from 'mobx-react';
import Loading from '../../shared/components/Loading';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { NavigationService } from '../../navigation';
import { ScreenNames } from '../../route/ScreenNames';
import { ToastHelper } from '../../shared/components/ToastHelper';
import TextInputFlat from '../../shared/components/TextInput/TextInputFlat';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import GradientButton from '../../shared/components/Buttons/GradientButton';

const Scanner = (props) => {
    const { t } = useTranslation();
    const [s, setS] = useState('');
    return useObserver(() => (
        <View style={[containerStyle.default, containerStyle.defaultBackground]}>
            <StatusBar barStyle={'dark-content'} />
            <SafeAreaView>
                <HeaderFull
                    title={t('explorer.qr')}
                    hasButton
                />
                <KeyboardAwareScrollView nestedScrollEnabled contentContainerStyle={styles.content}>
                    <QRCodeScanner
                        onRead={(a) => {
                            console.log(a.data);
                            if (a?.data !== '' && a?.data?.split("%%")?.length === 2) {
                                ToastHelper.showSuccess(t('explorer.join'))
                                NavigationService.navigate(ScreenNames.VideoCall, { url: a?.data, isGroup: true })
                            } else {

                            }
                        }}
                        flashMode={RNCamera.Constants.FlashMode.off}
                        topContent={''}
                        bottomContent={null}
                    />
                    {/* <TextInputFlat
                        onChangeText={(text) => {
                            setS(text);
                        }}
                        text={t('explorer.qr')}
                        props={props}
                        style={{ marginTop: 20, marginBottom: 20 }}
                    />
                    <GradientButton text={t('common.confirm')} onPress={() => {
                        if (s !== '') {
                            NavigationService.navigate(ScreenNames.VideoCall, { url: s, isGroup: true })
                        }
                    }} /> */}
                </KeyboardAwareScrollView>
            </SafeAreaView>
        </View>
    ));
};

export default withTheme(Scanner);
