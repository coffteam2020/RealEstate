/**
 * This is helpful for using instance of axios and do rest-api
 * Author: UraNashel - tan.nguyen@bigcosmt.com
 */

import Axios from 'axios';
// import * as api from "../shared/utils/constant/Constant";
import api from '../shared/utils/constant/Constant';
import LogManager from '../shared/utils/logging/LogManager';
import IALocalStorage from '../shared/utils/storage/IALocalStorage';
import {Alert} from 'react-native';
import {NavigationService} from '../navigation';
import {ScreenNames} from '../route/ScreenNames';

export const APP_URL = 'http://128.199.127.184:8080/api/';
// export const APP_URL = 'http://localhost:8080/api/';
const AxiosInstance = Axios.create({
  timeout: 200000,
});

function methodGet({url, ...config}) {
  return AxiosInstance.get(url, {...config});
}

function methodPost({url, data, ...config}) {
  return AxiosInstance.post(url, data, {...config});
}

function methodPut({url, data, ...config}) {
  return AxiosInstance.put(url, data, {...config});
}

function methodDelete({url, ...config}) {
  return AxiosInstance.delete(url, {...config});
}

function methodPatch({url, data, ...config}) {
  return AxiosInstance.patch(url, data, {...config});
}

const methodFunctions = {
  [api.METHOD.post]: methodPost,
  [api.METHOD.put]: methodPut,
  [api.METHOD.get]: methodGet,
  [api.METHOD.delete]: methodDelete,
  [api.METHOD.patch]: methodPatch,
};

export async function AxiosFetcher({
  method,
  data = undefined,
  url,
  hasToken = false,
  token,
  contentType = 'application/json',
  customBaseUrl, // This is helpful if we want to customize url
  hasBaseURL = true,
  params = undefined,
}) {
  // Set custom service url
  if (hasBaseURL) {
    AxiosInstance.defaults.baseURL =
      (customBaseUrl && customBaseUrl) || APP_URL;
  }
  console.log(
    '========> DATA: ' + LogManager.parseJsonObjectToJsonString(data),
  );
  console.log('========> METHOD: ' + method);
  // Get axios function by method
  let tokenUser = await IALocalStorage.getTokenUserInfo();
  console.log(
    '========> Token: ' + LogManager.parseJsonObjectToJsonString(tokenUser),
  );
  try {
    const res = await methodFunctions[method]({
      url,
      data,
      params,
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': contentType ? contentType : 'application/json',
        Authorization: hasToken ? `${tokenUser}` : null,
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods':
          'GET, POST, OPTIONS, PUT, PATCH, DELETE',
        'Access-Control-Allow-Headers':
          'Origin, X-Requested-With, Content-Type, Accept',
      },
    });
    console.log(
      ('========> RES: ' + customBaseUrl && customBaseUrl) ||
        url + '_' + LogManager.parseJsonObjectToJsonString(res?.data),
    );
    if (res?.data?.status === 401) {
      Alert.alert(
        'Session expired',
        'You term has been closed. Please try to login again',
        [
          {
            text: 'OK',
            onPress: () => {
              NavigationService.navigate(ScreenNames.LoginScreen);
            },
          },
        ],
      );
      return;
    }
    if (res.data.status === 102 || res.data.status === 200) {
      if (Array.isArray(res?.data)) {
        return {data: res?.data, success: true};
      } else if (typeof res?.data === 'string') {
        return {data: res?.data, success: true};
      } else {
        return {...res?.data, success: true};
      }
    } else {
      return res?.data;
    }
  } catch (error) {
    console.log(
      '========> ERROR: ' +
        url +
        '_' +
        LogManager.parseJsonObjectToJsonString(error ? error : error?.message),
    );
    return error?.response ? error?.response : error;
  }
}

export default AxiosFetcher;
