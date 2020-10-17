/* eslint-disable react-native/no-inline-styles */
import React, { } from 'react';
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

const Scanner = () => {
    const { t } = useTranslation();
    return useObserver(() => (
        <View style={[containerStyle.default, containerStyle.defaultBackground]}>
            <StatusBar barStyle={'dark-content'} />
            <SafeAreaView>
                <HeaderFull
                    title={t('explorer.qr')}
                    hasButton
                />
                <ScrollView nestedScrollEnabled contentContainerStyle={styles.content}>
                    <QRCodeScanner
                        onRead={(a) => {
                            console.log(a.data);
                            if (a?.data?.includes('https://meet.jit.si/')) {
                                ToastHelper.showSuccess(t('explorer.join'))
                                NavigationService.navigate(ScreenNames.VideoCall, { url: a?.data, isGroup: true })
                            } else {

                            }
                        }}
                        flashMode={RNCamera.Constants.FlashMode.off}
                        topContent={''}
                        bottomContent={null}
                    />
                </ScrollView>
            </SafeAreaView>
        </View>
    ));
};

export default withTheme(Scanner);
