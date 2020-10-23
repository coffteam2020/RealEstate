import React from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, Platform, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";

export const LocationView = ({ location, style }) => {
    const { t } = useTranslation();
    const openMaps = () => {
        const url = Platform.select({
            ios: `http://maps.apple.com/?ll=${location.latitude},${location.longitude}`,
            android: `http://maps.google.com/?q=${location.latitude},${location.longitude}`,
        });
        Linking.canOpenURL(url)
            .then((supported) => {
                if (supported) {
                    return Linking.openURL(url);
                }
            })
            .catch((err) => {
                console.error('An error occurred', err);
            });
    };
    if (!location?.latitude) {
        return null;
    }
    return (
        <TouchableOpacity
            onPress={() => {
                const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
                const latLng = `${location.latitude},${location.longitude}`;
                const label = 'Custom Label';
                const url = Platform.select({
                    ios: `${scheme}${label}@${latLng}`,
                    android: `${scheme}${latLng}(${label})`
                });
                Linking.openURL(url);
            }}
            style={[{ backgroundColor: 'gray', width: 200, height: 200, borderRadius: 20 }, style]}>
            {location ? <TouchableOpacity onPress={() => {
                const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
                const latLng = `${location.latitude},${location.longitude}`;
                const label = 'Custom Label';
                const url = Platform.select({
                    ios: `${scheme}${label}@${latLng}`,
                    android: `${scheme}${latLng}(${label})`
                });
                Linking.openURL(url);
            }}><MapView
                style={[{ height: 200, width: 200, borderRadius: 20 }, style]}
                region={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.003,
                    longitudeDelta: 0.004,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
            >
                    <Marker
                        coordinate={{
                            "latitude": location.latitude,
                            "longitude": location.longitude
                        }}
                        title={t('location.me')}
                        draggable
                        onPress={() => {
                            const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
                            const latLng = `${location.latitude},${location.longitude}`;
                            const label = 'Dapp Premium - 🚏';
                            const url = Platform.select({
                                ios: `${scheme}${label}@${latLng}`,
                                android: `${scheme}${latLng}(${label})`
                            });
                            Linking.openURL(url);
                        }} />

                </MapView></TouchableOpacity> : null}
        </TouchableOpacity>
    );
};