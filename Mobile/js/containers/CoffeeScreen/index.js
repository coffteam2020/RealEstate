import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, Image, TextInput, TouchableOpacity, ScrollView } from 'react-native';
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

var uuid = require('uuid');
var moment = require('moment');

export default function CoffeeScreen(props) {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [nameStore, setNameStore] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [coffees, setCoffees] = useState([]);
    const [date, setDate] = useState('');
    const [price, setPrice] = useState('');
    const [owner, setOwner] = useState('');
    const [isOpenAdd, setIsOpenAdd] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const { userStore } = useStores();
    const [urlState, setUrlState] = useState('');
    const [isAddMenu, setIsAddMenu] = useState(false);
    const [listMenu, setListMenu] = useState([]);
    const [avatarOwner, setAvatarOwner] = useState('');
    const [nameFood, setNameFood] = useState('');
    const [priceFood, setPriceFood] = useState(0);
    const [urlFood, setUrlFood] = useState('');

    useEffect(() => {
        getDataCoffee();
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

    const addDataCoffee = () => {
        let currentTime = moment().valueOf();
        let id = uuid.v4();
        FirebaseService.pushNewItem(
            Constant.SCHEMA.COFFEE,
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

    const getDataCoffee = async () => {
        setIsLoading(true);
        await firebase
            .database()
            .ref(Constant.SCHEMA.COFFEE)
            .on('value', async (snapshot) => {
                setIsLoading(false);
                const data = snapshot.val();
                const result = Object.values(data);
                const keys = Object.keys(data);
                result.forEach((item, i) => {
                    item.key = keys[i];
                });
                await setCoffees(result);
            });
        setIsLoading(false);
    };

    const onAddNewStore = () => {
        setIsOpenAdd(false);
        addDataCoffee();
    };

    const onPressAddMenu = () => {
        setIsAddMenu(isAddMenu => !isAddMenu)
    };

    const handleAddMenu = async () => {
        setIsAddMenu(isAddMenu => !isAddMenu);
        await listMenu.push({ nameFood, urlFood, priceFood });
        await setNameFood('');
        await setPriceFood('');
        await setUrlFood('');
    };

    const renderAddItem = () => {
        return (
            <ScrollView style={{ flex: 1, marginBottom: 20 }}>
                {isAddMenu === false &&
                    <>
                        {urlState === '' ?
                            <TouchableOpacity style={[styles.viewUploadImage, styles.center]} onPress={openPicker}>
                                <IC_UPLOAD name={"upload"} size={27} color={'#f68a20'} />
                                <Text style={styles.txtUploadImage}>{t('explorer.upload_image')}</Text>
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
                            placeholder={t('explorer.name_store')}
                            placeholderTextColor={'#816ca0'}
                            textInputStyle={styles.fieldEmailPhone}
                        />
                        <TextInput
                            value={address}
                            style={styles.textInputStyle}
                            onChangeText={text => setAddress(text)}
                            placeholder={t('explorer.address_store')}
                            placeholderTextColor={'#816ca0'}
                            textInputStyle={styles.fieldEmailPhone}
                        />
                        <TextInput
                            value={phone}
                            keyboardType="number-pad"
                            style={styles.textInputStyle}
                            onChangeText={text => setPhone(text)}
                            placeholder={t('explorer.phone_number')}
                            placeholderTextColor={'#816ca0'}
                            textInputStyle={styles.fieldEmailPhone}
                        />
                        <TextInput
                            value={owner}
                            style={styles.textInputStyle}
                            onChangeText={text => setOwner(text)}
                            placeholder={t('explorer.owner')}
                            placeholderTextColor={'#816ca0'}
                            textInputStyle={styles.fieldEmailPhone}
                        />
                        {avatarOwner === '' ?
                            <TouchableOpacity style={[styles.uploadAvatar, styles.center]} onPress={openPickerAvatar}>
                                <IC_UPLOAD name={"upload"} size={25} color={'#f68a20'} />
                                <Text style={[styles.txtUploadImage, { fontSize: 10 }]}>{t('explorer.upload_avatar')}</Text>
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
                        <Text style={styles.txtAddMenu}>{t('explorer.add_menu')}</Text>
                    </TouchableOpacity>
                    {isAddMenu === true &&
                        <>
                            {urlFood === '' ?
                                <TouchableOpacity style={[styles.viewUploadImage, styles.center]} onPress={openPickerFood}>
                                    <IC_UPLOAD name={"upload"} size={27} color={'#f68a20'} />
                                    <Text style={styles.txtUploadImage}>{t('explorer.upload_image')}</Text>
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
                                placeholder={t('explorer.name_food')}
                                placeholderTextColor={'#816ca0'}
                                textInputStyle={styles.fieldEmailPhone}
                            />
                            <TextInput
                                value={priceFood}
                                style={styles.textInputStyle}
                                onChangeText={text => setPriceFood(text)}
                                placeholder={t('explorer.price')}
                                keyboardType="number-pad"
                                placeholderTextColor={'#816ca0'}
                                textInputStyle={styles.fieldEmailPhone}
                            />
                            <TouchableOpacity onPress={handleAddMenu} style={styles.btnAddMenu}>
                                <Text style={styles.txtBtnAddMenu}>{t('explorer.add')}</Text>
                            </TouchableOpacity>
                        </>
                    }
                </View>
                {isAddMenu === false &&
                    <View style={styles.groupButton}>
                        <TouchableOpacity style={styles.btnCancel} onPress={() => { setIsOpenAdd(false) }}>
                            <Text style={styles.txtBtnCancel}>{t('explorer.cancel')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnAdd} onPress={onAddNewStore}>
                            <Text style={styles.txtBtnAdd}>{t('explorer.add')}</Text>
                        </TouchableOpacity>
                    </View>
                }
            </ScrollView>
        );
    };

    const onPressItem = (item) => {
        const { key } = item || {};
        NavigationService.navigate(ScreenNames.CoffeeDetailScreen, { key })
    };

    const renderItemCoffee = ({ item, index }) => {
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

    const renderCoffees = () => {
        if (coffees && coffees.length === 0) {
            return (
                <View style={{ flex: 1, marginTop: '50%' }}>
                    <Empty />
                </View>
            );
        } else {
            return (
                <FlatList
                    data={coffees}
                    contentContainerStyle={{ flex: 1, marginTop: '5%' }}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItemCoffee}
                />
            );
        }
    };

    return (
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: '#fff', paddingBottom: 20 }}>
            <HeaderFull
                hasButton={true}
                title={t('explorer.coffee')}
                onPress={() => { setIsOpenAdd(isOpenAdd => !isOpenAdd) }}
                rightIco={<Ionicons name="add" size={30} color={colors.blackInput} />}
            />
            <View style={styles.content}>
                {isOpenAdd === false ?
                    <>
                        {renderCoffees()}
                    </>
                    :
                    <>
                        {renderAddItem()}
                    </>
                }
            </View>
        </ScrollView>
    );
};