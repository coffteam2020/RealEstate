import React, { useRef } from 'react';
import {
    SafeAreaView,
    View,
    TouchableWithoutFeedback,
    StyleSheet,
    Text
} from 'react-native'
import { ScreenHeight } from '../shared/utils/dimension/Divices';
import { withTheme } from 'react-native-paper';
import * as Animatable from "react-native-animatable";


const TabBar = (props) => {

    const {
        navigation: { state: { index, routes } },
        getLabelText,
        style,
        activeTintColor,
        inactiveTintColor,
        renderIcon,
        jumpTo,
        showLabel,
        backgroundFeaturedIcon,
        tabFeatured,
        activeFeaturedTintColor,
        inactiveFeatureTintColor
    } = props;

    return (
        <SafeAreaView style={{
            flexDirection: 'row',
            height: ScreenHeight / 9,
            width: '100%',
            backgroundColor: props.theme.colorsApp.backgroundInput,
            ...style
        }}>
            {
                routes.map((route, idx) => {
                    let customRef = useRef(null);
                    return (
                        <SafeAreaView
                            key={route.key}
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <TouchableWithoutFeedback
                                onPress={() => {
                                    customRef.swing(800);
                                    jumpTo(route.key)
                                }}
                            >
                                <Animatable.View ref={ref => customRef = ref} style={[styles.iconContainer, index === idx ? {backgroundColor: props.theme.dark ? "#1C383A" : "#D0F0F0"} : {}]}>
                                    <View style={route.key == tabFeatured ? [{ backgroundColor: backgroundFeaturedIcon }, styles.customIcon] : styles.defaultIcon}>
                                        {renderIcon({
                                            route,
                                            focused: index === idx,
                                            tintColor: index === idx ?
                                                route.key !== tabFeatured ?
                                                    activeTintColor
                                                    :
                                                    activeFeaturedTintColor
                                                :
                                                route.key !== tabFeatured ?
                                                    inactiveTintColor
                                                    :
                                                    inactiveFeatureTintColor
                                        })}
                                    </View>
                                    {}

                                    {showLabel ? <Text style={[styles.iconLabel, { color: index === idx ? activeTintColor : inactiveTintColor }]}>
                                        {route.key !== tabFeatured ? getLabelText({
                                            route,
                                        }) : null}
                                    </Text> : null}
                                </Animatable.View>
                            </TouchableWithoutFeedback>
                        </SafeAreaView>
                    )
                }
                )
            }
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    customIcon: {
        height: 60,
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        transform: [
            { translateY: -20 }
        ]
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 38,
        width: 38,
        borderRadius: 12
    },
    iconLabel: {
        fontSize: 9,
        fontWeight: '600'
    }
})

export default withTheme(TabBar);