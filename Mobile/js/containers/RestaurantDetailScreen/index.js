import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, Image, TextInput, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import HeaderFull from '../../shared/components/Header/HeaderFull';
import { useTranslation } from 'react-i18next';
import Empty from '../../shared/components/Empty';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../shared/utils/colors/colors';
import { FirebaseService } from '../../api/FirebaseService';
import { firebase } from '@react-native-firebase/database';
import Constant from '../../shared/utils/constant/Constant';
import { NavigationService } from '../../navigation';
import { ScreenNames } from '../../route/ScreenNames';
import IC_HOME from 'react-native-vector-icons/MaterialIcons';
import IC_ADDRESS from 'react-native-vector-icons/Entypo';
import IC_PHONE from 'react-native-vector-icons/Entypo';
import IC_OWNER from 'react-native-vector-icons/FontAwesome';

export default function RestaurantDetailScreen(props) {
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
            .ref(Constant.SCHEMA.RESTAURANT)
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
                title={t('explorer.restaurant_detail')}
            />
            <View style={styles.content}>
                <Image
                    source={{ uri: dataStore.url }}
                    style={styles.imageBanner}
                    resizeMode="stretch"
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
                        <Text style={styles.txtAddressStore}> {'Exploer'}</Text>
                    </View>
                    <Image
                        source={{ uri: dataStore?.avatar }}
                        style={styles.avatarStyle}
                    />
                    <View style={{ width: '100%', height: 'auto'}}>
                        <FlatList
                            data={dataStore?.menu}
                            showsVerticalScrollIndicator={false}
                            scrollEnabled={true}
                            renderItem={(item, index) => {
                                return (
                                    <View style={styles.itemMenu}>
                                        <Image source={{ uri: 'https://d1uz88p17r663j.cloudfront.net/original/e1894cc842da12b03b2cdf223250799d_Thumb_-crop083_G%C3%A0_lu%E1%BB%99c_l%C3%A1_chanh.jpg' }} style={styles.imageFood} />
                                        <View style={{paddingVertical: 5}}>
                                            <Text style={styles.txtItemMenu}>{item.item?.nameFood}</Text>
                                            <Text style={styles.txtPrice}>{`${item.item?.price}VNĐ`}</Text>
                                            <Text style={styles.txtDescript}>{'Gà luộc ngon, thịt không bị nát do quá chín khiến ai ai cũng nao lòng bởi hương thơm thoảng rất nhẹ, ...'}</Text>
                                        </View>
                                    </View>
                                );
                            }}
                        />
                    </View>
                </View>
            </View>
        </View>
    )
}
