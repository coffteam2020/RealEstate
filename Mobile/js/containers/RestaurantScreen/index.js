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
import ImagePicker from 'react-native-image-picker';
import { uploadFileToFireBase } from '../../shared/utils/firebaseStorageUtils/index';
import IC_UPLOAD from 'react-native-vector-icons/Feather';
import { useStores } from '../../store/useStore';
import { ScrollView } from 'react-native-gesture-handler';

var uuid = require('uuid');
var moment = require('moment');

export default function RestaurantScreen(props) {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [nameStore, setNameStore] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [owner, setOwner] = useState('');
    const [restaurant, setRestaurant] = useState([]);
    const [isOpenAdd, setIsOpenAdd] = useState(false);
    const { userStore } = useStores();
    const [urlState, setUrlState] = useState('');
    const [nameFood, setNameFood] = useState('');
    const [priceFood, setPriceFood] = useState(0);
    const [urlFood, setUrlFood] = useState('');
    const [isAddMenu, setIsAddMenu] = useState(false);
    const [listMenu, setListMenu] = useState([]);
    const [descriptionFood, setDescriptionFood] = useState('');
    const [avatarOwner, setAvatarOwner] = useState('');

    useEffect(() => {
        getDataRestaurant();
    }, []);

    const IMAGE_CONFIG = {
        title: t('imagePicker.name'),
        cancelButtonTitle: t('common.cancel'),
        takePhotoButtonTitle: t('imagePicker.camera'),
        chooseFromLibraryButtonTitle: t('imagePicker.name'),
        storageOptions: {
            skipBackup: true,
            path: 'images',
        },
    };

    const addDataRestaurant = () => {
        // let currentTime = moment().valueOf();
        let id = uuid.v4();
        FirebaseService.pushNewItem(
            Constant.SCHEMA.RESTAURANT,
            JSON.parse(
                JSON.stringify({
                    url: urlState,
                    id: id,
                    address: address,
                    name: nameStore,
                    phone: phone,
                    owner: owner,
                    avatar: avatarOwner,
                    menu: listMenu
                }),
            ),
        );
        setListMenu([]);
    };

    const openPicker = async () => {
        ImagePicker.showImagePicker(IMAGE_CONFIG, (response) => {
            // console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: response.uri };
                userStore.userInfo = { ...userStore?.userInfo, avatar: source?.uri };
                setIsLoading(true);
                Promise.resolve(uploadFileToFireBase(response, userStore?.userInfo?.id))
                    .then(async (val) => {
                        await setUrlState(val)
                        setIsLoading(false);
                    })
                    .catch((error) => {
                        ToastHelper.showError(t('error.common'));
                        setIsLoading(false);
                    });
            }
        });
    };

    const openPickerAvatar = async () => {
        ImagePicker.showImagePicker(IMAGE_CONFIG, (response) => {
            // console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: response.uri };
                userStore.userInfo = { ...userStore?.userInfo, avatar: source?.uri };
                setIsLoading(true);
                Promise.resolve(uploadFileToFireBase(response, userStore?.userInfo?.id))
                    .then(async (val) => {
                        await setAvatarOwner(val)
                        setIsLoading(false);
                    })
                    .catch((error) => {
                        ToastHelper.showError(t('error.common'));
                        setIsLoading(false);
                    });
            }
        });
    };

    const openPickerFood = async () => {
        ImagePicker.showImagePicker(IMAGE_CONFIG, (response) => {
            // console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: response.uri };
                userStore.userInfo = { ...userStore?.userInfo, avatar: source?.uri };
                setIsLoading(true);
                Promise.resolve(uploadFileToFireBase(response, userStore?.userInfo?.id))
                    .then(async (val) => {
                        await setUrlFood(val)
                        setIsLoading(false);
                    })
                    .catch((error) => {
                        ToastHelper.showError(t('error.common'));
                        setIsLoading(false);
                    });
            }
        });
    };

    const getDataRestaurant = async () => {
        setIsLoading(true);
        await firebase
            .database()
            .ref(Constant.SCHEMA.RESTAURANT)
            .on('value', async (snapshot) => {
                setIsLoading(false);
                const data = snapshot.val();
                const result = Object.values(data);
                const keys = Object.keys(data);
                result.forEach((item, i) => {
                    item.key = keys[i];
                });
                await setRestaurant(result);
            });
        setIsLoading(false);
    };

    const onAddNewStore = () => {
        setIsOpenAdd(false);
        addDataRestaurant();
    };

    const onPressAddMenu = () => {
        setIsAddMenu(isAddMenu => !isAddMenu)
    };

    const handleAddMenu = async () => {
        setIsAddMenu(isAddMenu => !isAddMenu);
        await listMenu.push({ nameFood, urlFood, priceFood, descriptionFood });
        await setNameFood('');
        await setPriceFood('');
        await setUrlFood('');
        await setDescriptionFood('');
    };

    const renderAddItem = () => {
        return (
            <ScrollView style={{ flex: 1, marginBottom: 20 }}>
                {isAddMenu === false &&
                    <>
                        {urlState === '' ?
                            <TouchableOpacity style={[styles.viewUploadImage, styles.center]} onPress={openPicker}>
                                <IC_UPLOAD name={"upload"} size={27} color={'#f68a20'} />
                                <Text style={styles.txtUploadImage}>{'Upload Image'}</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity style={styles.viewUploadImage} onPress={openPicker}>
                                <Image source={{ uri: urlState }} style={{ width: 146, height: 117, alignSelf: 'center' }} />
                            </TouchableOpacity>
                        }
                        <TextInput
                            value={nameStore}
                            style={styles.textInputStyle}
                            onChangeText={text => setNameStore(text)}
                            placeholder={t('Name Store')}
                            textInputStyle={styles.fieldEmailPhone}
                        />
                        <TextInput
                            value={address}
                            style={styles.textInputStyle}
                            onChangeText={text => setAddress(text)}
                            placeholder={t('Address Store')}
                            textInputStyle={styles.fieldEmailPhone}
                        />
                        <TextInput
                            value={owner}
                            style={styles.textInputStyle}
                            onChangeText={text => setOwner(text)}
                            placeholder={t('Owner')}
                            textInputStyle={styles.fieldEmailPhone}
                        />
                        <TextInput
                            value={phone}
                            keyboardType="number-pad"
                            style={styles.textInputStyle}
                            onChangeText={text => setPhone(text)}
                            placeholder={t('Phone number')}
                            textInputStyle={styles.fieldEmailPhone}
                        />
                        {avatarOwner === '' ?
                            <TouchableOpacity style={[styles.uploadAvatar, styles.center]} onPress={openPickerAvatar}>
                                <IC_UPLOAD name={"upload"} size={25} color={'#f68a20'} />
                                <Text style={[styles.txtUploadImage,{fontSize: 10}]}>{'Upload Avatar'}</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity style={styles.uploadAvatar} onPress={openPickerAvatar}>
                                <Image source={{ uri: avatarOwner }} style={{ width: 118, height: 118, borderRadius: 120, alignSelf: 'center' }} />
                            </TouchableOpacity>
                        }
                    </>
                }
                <View style={styles.viewAddmenu}>
                    <TouchableOpacity onPress={onPressAddMenu}>
                        <Text style={styles.txtAddMenu}>{t('Add menu')}</Text>
                    </TouchableOpacity>
                    {isAddMenu === true &&
                        <>
                            {urlFood === '' ?
                                <TouchableOpacity style={[styles.viewUploadImage, styles.center]} onPress={openPickerFood}>
                                    <IC_UPLOAD name={"upload"} size={27} color={'#f68a20'} />
                                    <Text style={styles.txtUploadImage}>{'Upload Image'}</Text>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity style={styles.viewUploadImage} onPress={openPickerFood}>
                                    <Image source={{ uri: urlFood }} style={{ width: 146, height: 117, alignSelf: 'center' }} />
                                </TouchableOpacity>
                            }
                            <TextInput
                                value={nameFood}
                                style={styles.textInputStyle}
                                onChangeText={text => setNameFood(text)}
                                placeholder={t('Name Food')}
                                textInputStyle={styles.fieldEmailPhone}
                            />
                            <TextInput
                                value={priceFood}
                                style={styles.textInputStyle}
                                onChangeText={text => setPriceFood(text)}
                                placeholder={t('Price')}
                                keyboardType="number-pad"
                                textInputStyle={styles.fieldEmailPhone}
                            />
                            <TextInput
                                value={descriptionFood}
                                style={styles.textInputStyle}
                                onChangeText={text => setDescriptionFood(text)}
                                placeholder={t('Description')}
                                textInputStyle={styles.fieldEmailPhone}
                            />
                            <TouchableOpacity onPress={handleAddMenu} style={styles.btnAddMenu}>
                                <Text style={styles.txtBtnAddMenu}>{t('Add')}</Text>
                            </TouchableOpacity>
                        </>
                    }
                </View>
                {isAddMenu === false &&
                    <View style={styles.groupButton}>
                        <TouchableOpacity style={styles.btnCancel} onPress={() => { setIsOpenAdd(false) }}>
                            <Text style={styles.txtBtnCancel}>{t('Cancel')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnAdd} onPress={onAddNewStore}>
                            <Text style={styles.txtBtnAdd}>{t('Add')}</Text>
                        </TouchableOpacity>
                    </View>
                }
            </ScrollView>
        );
    };

    const onPressItem = (item) => {
        const { key } = item || {};
        NavigationService.navigate(ScreenNames.RestaurantDetailScreen, { key })
    };

    const renderItemRestaurant = ({ item, index }) => {
        return (
            <TouchableOpacity style={styles.itemCoffee} onPress={() => { onPressItem(item) }}>
                <Image source={{ uri: item?.url }} style={styles.avatarCoffee} />
                <View style={styles.itemChildren}>
                    <Text style={styles.itemName}>{item?.name}</Text>
                    <Text style={styles.itemAddress}>{`${item?.address}`}</Text>
                    {(item && item?.menu) &&
                        <FlatList
                            data={item?.menu}
                            numColumns={2}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item, index }) => (
                                <View style={styles.itemMenu}>
                                    <Text style={styles.txtMenuItem}>{item?.nameFood}</Text>
                                    <Text style={styles.txtMenuItemPrice}>{`  ${item?.priceFood}VNĐ`}</Text>
                                </View>
                            )}
                        />
                    }
                </View>
            </TouchableOpacity>
        );
    };

    const renderRestaurant = () => {
        if (restaurant && restaurant.length === 0) {
            return (
                <View style={{ flex: 1, marginTop: '50%' }}>
                    <Empty />
                </View>
            );
        } else {
            return (
                <FlatList
                    data={restaurant}
                    contentContainerStyle={{ flex: 1, marginTop: '5%' }}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItemRestaurant}
                />
            );
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <HeaderFull
                hasButton={true}
                title={t('explorer.restaurant')}
                onPress={() => { setIsOpenAdd(isOpenAdd => !isOpenAdd) }}
                rightIco={<Ionicons name="add" size={30} color={colors.blackInput} />}
            />
            <View style={styles.content}>
                {isOpenAdd === false ?
                    <>
                        {renderRestaurant()}
                    </>
                    :
                    <>
                        {renderAddItem()}
                    </>
                }
            </View>
        </View>
    );
};