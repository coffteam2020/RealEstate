import React, { useState, useEffect } from 'react';
import { Text, View, Image, FlatList, ScrollView } from 'react-native';
import { styles } from './styles';
import HeaderFull from '../../shared/components/Header/HeaderFull';
import { useTranslation } from 'react-i18next';
import { firebase } from '@react-native-firebase/database';
import Constant from '../../shared/utils/constant/Constant';
import IC_HOME from 'react-native-vector-icons/MaterialIcons';
import IC_ADDRESS from 'react-native-vector-icons/Entypo';
import IC_PHONE from 'react-native-vector-icons/Entypo';
import IC_OWNER from 'react-native-vector-icons/FontAwesome';

export default function CoffeeDetailScreen(props) {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [dataStore, setdataStore] = useState({});
    const key = props.navigation.state.params.key;

    useEffect(() => {
        getDetailCoffee();
    }, []);

    const getDetailCoffee = async () => {
        setIsLoading(true);
        await firebase
            .database()
            .ref(Constant.SCHEMA.COFFEE)
            .child(key)
            .once('value', async (snapshot) => {
                const data = snapshot.val();
                await setdataStore(data)
            })
    };


    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <HeaderFull
                hasButton={true}
                title={t('explorer.coffee_detail')}
            />
            <View style={styles.content}>
                <Image
                    source={{ uri: dataStore?.url }}
                    style={styles.imageBanner}
                />
                <View style={styles.contentInfo}>
                    <View style={styles.rows}>
                        <IC_HOME size={20} name="location-city" style={styles.marginRight} color={'grey'} />
                        <Text style={styles.txtNameStore}>{dataStore?.name}</Text>
                    </View>
                    <View style={styles.rows}>
                        <IC_ADDRESS size={20} name="location" style={styles.marginRight} color={'grey'} />
                        <Text style={styles.txtAddressStore}>{dataStore?.address}</Text>
                    </View>
                    <View style={styles.rows}>
                        <IC_PHONE size={20} name="old-phone" style={styles.marginRight} color={'grey'} />
                        <Text style={styles.txtAddressStore}>{dataStore?.phone}</Text>
                    </View>

                    <View style={styles.rows}>
                        <IC_OWNER size={20} name="reddit" style={styles.marginRight} color={'grey'} />
                        <Text style={styles.txtAddressStore}> {dataStore?.owner}</Text>
                    </View>
                    <Image
                        source={{ uri: dataStore?.avatar }}
                        style={styles.avatarStyle}
                    />
                    <ScrollView style={{ width: '100%', height: 'auto' }}>
                        <FlatList
                            data={dataStore?.menu}
                            showsVerticalScrollIndicator={false}
                            scrollEnabled={true}
                            renderItem={(item, index) => {
                                console.log('check item coffee',item);
                                
                                return (
                                    <View style={styles.itemMenu}>
                                        <Image source={{ uri: item?.item?.urlFood }} style={styles.imageFood} />
                                        <View style={{ paddingVertical: 5 }}>
                                            <Text style={styles.txtItemMenu}>{item?.item?.nameFood}</Text>
                                            <Text style={styles.txtPrice}>{`${item?.item?.priceFood}VNĐ`}</Text>
                                        </View>
                                    </View>
                                );
                            }}
                        />
                    </ScrollView>
                </View>
            </View>
        </View>
    )
}
