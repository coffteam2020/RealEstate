import React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from "react-native";
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
    return (
        <TouchableOpacity
            onPress={() => { }}
            style={[{ backgroundColor: 'gray', width: 200, height: 200, borderRadius: 20 }, style]}>
            <MapView
                style={[{ height: 200, width: 200, borderRadius: 20 }, style]}
                region={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                }}
                initialRegion={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.001
                }}
                annotations={[
                    {
                        latitude: location.latitude,
                        longitude: location.longitude,
                    },
                ]}
                scrollEnabled={true}
                zoomEnabled={true}
            >
                <Marker
                    coordinate={{
                        "latitude": location.latitude,
                        "longitude": location.longitude
                    }}
                    title={t('location.me')}
                    draggable />

            </MapView>
        </TouchableOpacity>
    );
};