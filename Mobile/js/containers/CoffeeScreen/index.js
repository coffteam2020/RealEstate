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
                    url: 'https://highlandscoffee.com.vn/vnt_upload/news/11_2018/5.jpg',
                    createdAt: currentTime,
                    id: id,
                    address: address,
                    name: nameStore,
                    owner: owner,
                    avatar: urlState,
                    menu: [
                        {
                            id: 1,
                            nameFood: 'Coffee',
                            price: '10 000'
                        },
                        {
                            id: 2,
                            nameFood: 'Coffee Milk',
                            price: '15 000'
                        },
                        {
                            id: 3,
                            nameFood: 'Milk Tea',
                            price: '15 000'
                        }
                    ]
                }),
            ),
        );
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

    // const openCamera = () => {
    //     ImagePicker.launchCamera(IMAGE_CONFIG, (response) => {
    //       // console.log('Response = ', response);
    //       if (response.didCancel) {
    //         console.log('User cancelled image picker');
    //       } else if (response.error) {
    //         console.log('ImagePicker Error: ', response.error);
    //       } else if (response.customButton) {
    //         console.log('User tapped custom button: ', response.customButton);
    //       } else {
    //         setIsLoading(true);
    //         Promise.resolve(uploadFileToFireBase(response, user?.id))
    //           .then(async (val) => {
    //             await setUrlState(val)
    //             setIsLoading(false);
    //           })
    //           .catch((error) => {
    //             console.log(error.message);
    //             ToastHelper.showError(t('error.common'));
    //             setIsLoading(false);
    //           });
    //       }
    //     });
    //   };

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
                console.log('result ===', result);

                await setCoffees(result);
            });
        setIsLoading(false);
    };

    const onAddNewStore = () => {
        setIsOpenAdd(false);
        addDataCoffee();
    };

    const renderAddItem = () => {
        return (
            <View style={{ flex: 1 }}>
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
                    value={phone}
                    keyboardType="number-pad"
                    style={styles.textInputStyle}
                    onChangeText={text => setPhone(text)}
                    placeholder={t('Phone number')}
                    textInputStyle={styles.fieldEmailPhone}
                />
                <TextInput
                    value={owner}
                    style={styles.textInputStyle}
                    onChangeText={text => setOwner(text)}
                    placeholder={t('Owner')}
                    textInputStyle={styles.fieldEmailPhone}
                />
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
                <View style={styles.groupButton}>
                    <TouchableOpacity style={styles.btnCancel} onPress={() => { setIsOpenAdd(false) }}>
                        <Text style={styles.txtBtnCancel}>{t('Cancel')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnAdd} onPress={onAddNewStore}>
                        <Text style={styles.txtBtnAdd}>{t('Add')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
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
                                    <Text style={styles.txtMenuItemPrice}>{`  ${item?.price}VNĐ`}</Text>
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
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
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
        </View>
    );
};