import axios, {AxiosRequestConfig} from 'axios';
import {BASE_URL, secureStoreKeys} from '../constant';
import {FetchResponse, FetchResponseError} from '../types/fetch.types';
import {AppThunk} from '../types/store.types';
import {setErrors} from './global/global.slice';
import {getData} from '../utils/asyncStorage';

export const AxiosInstance = axios.create({
  baseURL: BASE_URL,
});

export const fetch = async <T>(
  config: AxiosRequestConfig,
  isPrivate = true,
  fromSocial = false,
): Promise<FetchResponse<T>> => {
  const result: FetchResponse<T> = {
    data: undefined,
    errors: null,
    statusCode: null,
    errorMessage: null,
    headers: null,
    authorization: {token: '', type: ''},
    status: null,
  };

  try {
    const token = await getData(secureStoreKeys.JWT_TOKEN);
    if (!token && isPrivate) {
      result.statusCode = 401;
      result.errors = {
        data: null,
        message: 'Not logged in',
        status: 0,
        statusCode: 401,
      };
      result.errorMessage = 'Not logged in';

      return result;
    }

    const axConfig = {...config};

    if (token && isPrivate) {
      const headers = {
        Authorization: `bearer ${token}`,
      };

      if (axConfig?.headers) {
        axConfig.headers = {...axConfig.headers, ...headers};
      } else {
        axConfig.headers = headers;
      }
    }

    console.log('API ----->', axConfig.url, axConfig);

    const response = await AxiosInstance.request<{
      data?: T;
      errors?: FetchResponseError;
    }>(axConfig);
    // console.log("response ----->", response);

    if (response.status.toString().startsWith('2')) {
      // console.log("RESPONSE : ", response);

      result.data = response.data;
      result.statusCode = response.status;
      result.headers = response.headers;
      result.authorization = response.data.authorization;
      return result;
    }
  } catch (err: any) {
    console.log('err ------>', err?.response);

    if (err?.response) {
      if (err?.response?.status.toString().startsWith('5')) {
        result.statusCode = err?.response?.status;
        result.errorMessage = err?.response?.data?.message;
        result.errors = {
          ...err?.response?.data,
          statusCode: err?.response?.status,
        };
      } else if (err?.response?.status == 403) {
        result.statusCode = err?.response?.status;
        result.status = err?.response?.data?.status;
        result.errorMessage =
          err?.response?.data?.message || 'Something went wrong!';
        result.errors = {
          ...err?.response?.data,
          statusCode: err?.response?.status,
        };
      } else {
        // console.log("err 2------>", err.response);

        result.statusCode = err?.response?.status;
        result.status = err?.response?.data?.status;
        result.errorMessage =
          err?.response?.data?.message || 'Something went wrong!';
        result.errors = {
          ...err?.response?.data,
          statusCode: err?.response?.status,
        };
      }
    }
  }

  // console.log("API RESPONSE - - - - ", JSON.stringify(result));
  return result;
};

export const fetchAction =
  <T>(
    config: AxiosRequestConfig,
    isPrivate = true,
    fromSocial = false,
  ): AppThunk<Promise<FetchResponse<T>>> =>
  async dispatch => {
    const res = await fetch<T>(config, isPrivate, fromSocial);
    const {data, errors, errorMessage, statusCode, headers, authorization} =
      res;

    if (errors) {
      dispatch(setErrors(errors));
    }

    return {
      data,
      errors,
      errorMessage,
      statusCode,
      headers,
      authorization,
    };
  };
