import {createAsyncThunk} from '@reduxjs/toolkit';
import {TokenPayload, TokenPayload1} from '../../types/authentication.types';
import {FetchResponseError} from '../../types/fetch.types';
import {RootReduxState} from '../../types/store.types';
import {setData} from '../../utils/asyncStorage';
import {fetchAction} from '../fetch';
import {setUserData} from '../settings/settings.slice';
import {API} from '../../constant/apiEndpoints';
import {USER_DATA, secureStoreKeys} from '../../constant';
// import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

export const userRegistration = createAsyncThunk<
  true,
  {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    password: string;
    phone_number: string;
    iso: string;
    device_type: string;
    device_token: string;
  },
  {state: RootReduxState; rejectValue: FetchResponseError}
>(
  'authentication/userRegistration',
  async (
    {
      first_name,
      last_name,
      username,
      email,
      password,
      phone_number,
      iso,
      device_type,
      device_token,
    },
    {dispatch, rejectWithValue},
  ) => {
    const {errors, data, authorization} = await dispatch(
      fetchAction<TokenPayload>(
        {
          url: API.REGISTER,
          method: 'POST',
          data: {
            first_name,
            last_name,
            username,
            email,
            password,
            phone_number,
            iso,
            device_type,
            device_token,
          },
        },
        false,
      ),
    );

    if (errors) {
      return rejectWithValue(errors);
    }

    console.log('data', data);
    console.log('authorization', authorization);

    if (authorization) {
      dispatch(setUserData(data?.user));
      setData(USER_DATA, data?.user);
    }

    return true;
  },
);
export const userLogin = createAsyncThunk<
  any,
  {
    phone_number: string;
    password: string;
    is_social: number;
    device_type: string;
    device_token: string;
  },
  {state: RootReduxState; rejectValue: FetchResponseError}
>(
  'authentication/userLogin',
  async (
    {phone_number, password, is_social, device_token, device_type},
    {dispatch, rejectWithValue},
  ) => {
    const {errors, data} = await dispatch(
      fetchAction<TokenPayload>(
        {
          url: API.LOGIN,
          method: 'POST',
          data: {
            phone_number,
            password,
            is_social,
            device_token,
            device_type,
          },
        },
        false,
      ),
    );

    if (errors) {
      return rejectWithValue(errors);
    }

    if (data?.authorization) {
      dispatch(setUserData(data?.user));
      setData(USER_DATA, data?.user);
      await setData(secureStoreKeys.JWT_TOKEN, data?.authorization.token);
    }

    return data;
  },
);
export const userForgotPassword = createAsyncThunk<
  any,
  {phone_number: string},
  {state: RootReduxState; rejectValue: FetchResponseError}
>(
  'authentication/userForgotPassword',
  async ({phone_number}, {dispatch, rejectWithValue}) => {
    const {errors, data} = await dispatch(
      fetchAction<TokenPayload1>(
        {
          url: API.FORGOT_PASSWORD,
          method: 'POST',
          data: {
            phone_number,
          },
        },
        false,
      ),
    );

    console.log('data', data);

    if (errors) {
      return rejectWithValue(errors);
    }

    // await setData(secureStoreKeys.JWT_TOKEN, data.token);

    return data;
  },
);

export const userOTPCode = createAsyncThunk<
  any,
  {email?: string; code: string; type: string; phone_number?: string},
  {state: RootReduxState; rejectValue: FetchResponseError}
>(
  'authentication/userOTPCode',
  async ({code, email, type, phone_number}, {dispatch, rejectWithValue}) => {
    const {errors, data} = await dispatch(
      fetchAction<TokenPayload>(
        {
          url: API.VERIFY_OTP_CODE,
          method: 'POST',
          data: {
            code,
            ...(email && {
              email,
            }),
            ...(type && {
              type,
            }),
            ...(phone_number && {
              phone_number,
            }),
          },
        },
        false,
      ),
    );

    console.log('data', data);
    console.log('errors', errors);

    if (errors) {
      return rejectWithValue(errors);
    }

    // await setData(secureStoreKeys.JWT_TOKEN, data.token);

    return data;
  },
);

export const userChangePassword = createAsyncThunk<
  any,
  {old_password: string; password: string},
  {state: RootReduxState; rejectValue: FetchResponseError}
>(
  'authentication/userChangePassword',
  async ({old_password, password}, {dispatch, rejectWithValue}) => {
    const {errors, data} = await dispatch(
      fetchAction<TokenPayload1>(
        {
          url: API.CHANGE_PASSWORD,
          method: 'POST',
          data: {
            old_password,
            password,
          },
        },
        true,
      ),
    );

    if (errors) {
      return rejectWithValue(errors);
    }

    // await setData(secureStoreKeys.JWT_TOKEN, data.token);

    return data;
  },
);

export const userResetPassword = createAsyncThunk<
  any,
  {password: string; phone_number: string; type: string},
  {state: RootReduxState; rejectValue: FetchResponseError}
>(
  'authentication/userResetPassword',
  async ({password, phone_number, type}, {dispatch, rejectWithValue}) => {
    const {errors, data} = await dispatch(
      fetchAction<TokenPayload1>(
        {
          url: API.RESET_PASSWORD,
          method: 'POST',
          data: {
            password,
            phone_number,
            type,
          },
        },
        false,
      ),
    );

    if (errors) {
      return rejectWithValue(errors);
    }
    return data;
  },
);

export const userResendOTP = createAsyncThunk<
  any,
  {phone_number: string},
  {state: RootReduxState; rejectValue: FetchResponseError}
>(
  'authentication/userResendOTP',
  async ({phone_number}, {dispatch, rejectWithValue}) => {
    const {errors, data} = await dispatch(
      fetchAction<TokenPayload1>(
        {
          url: API.RESEND_OTP,
          method: 'POST',
          data: {
            ...(phone_number && {
              phone_number,
            }),
          },
        },
        false,
      ),
    );

    console.log('errors', errors);
    console.log('data', data);

    if (errors) {
      return rejectWithValue(errors);
    }
    return data;
  },
);

export const oAuthLogin = createAsyncThunk<
  any,
  {
    first_name: string;
    last_name: string;
    username: string;
    // profile_image: string;
    email: string;
    social_id: string;
    is_social: string;
    social_type: string;
    iso: string;
    device_type: string;
    device_token: string;
    // credential: FirebaseAuthTypes.AuthCredential;
  },
  {state: RootReduxState; rejectValue: FetchResponseError}
>(
  'authentication/oAuthLogin',
  async (
    {
      first_name,
      last_name,
      username,
      // profile_image,
      is_social,
      social_type,
      iso,
      device_type,
      device_token,
      // credential,
    },
    {dispatch, rejectWithValue},
  ) => {
    // try {
    //   await auth().signInWithCredential(credential);
    // } catch (e) {
    //   return rejectWithValue(e);
    // }
    const {errors, data, authorization} = await dispatch(
      fetchAction<TokenPayload>(
        {
          url: API.OAUTH_LOGIN,
          method: 'POST',
          data: {
            // first_name: auth()?.currentUser?.displayName || first_name,
            // last_name: auth()?.currentUser?.displayName || last_name,
            // username: username,
            // // profile_image,
            // email: auth()?.currentUser?.email,
            // social_id: auth()?.currentUser?.uid,
            is_social,
            social_type,
            iso,
            device_type,
            device_token,
          },
        },
        false,
        true,
      ),
    );

    if (errors) {
      return rejectWithValue(errors);
    }

    console.log('USER data - - - - ', data?.user);
    if (data?.user) {
      dispatch(setUserData(data?.user));
      setData(USER_DATA, data?.user);
    }

    if (data?.authorization) {
      await setData(secureStoreKeys.JWT_TOKEN, data?.authorization.token);
    }

    return data;
  },
);

export const oAuthRegister = createAsyncThunk<
  any,
  {
    first_name: string;
    last_name: string;
    email: string;
    social_id: string;
    is_social: number;
    social_type: string;
    type: string;
  },
  {state: RootReduxState; rejectValue: FetchResponseError}
>(
  'authentication/oAuthRegister',
  async (
    {first_name, last_name, email, social_id, is_social, social_type, type},
    {dispatch, rejectWithValue},
  ) => {
    const {errors, data} = await dispatch(
      fetchAction<TokenPayload>(
        {
          url: API.OAUTH_REGISTER,
          method: 'POST',
          data: {
            first_name,
            last_name,
            email,
            social_id,
            is_social,
            social_type,
            type,
          },
        },
        false,
        true,
      ),
    );

    if (errors) {
      return rejectWithValue(errors);
    }

    if (data?.authorization) {
      dispatch(setUserData(data?.data));
      setData(USER_DATA, data?.data);
      await setData(secureStoreKeys.JWT_TOKEN, data?.authorization.token);
    }

    return data;
  },
);

export const logout = createAsyncThunk<
  any,
  void,
  {state: RootReduxState; rejectValue: FetchResponseError}
>('authentication/logout', async (_, {dispatch, rejectWithValue}) => {
  const {errors} = await dispatch(
    fetchAction(
      {
        url: API.LOGOUT,
        method: 'GET',
      },
      true,
    ),
  );

  if (errors) {
    return rejectWithValue(errors);
  }

  return null;
});

// Add Address

export const userAddress = createAsyncThunk<
  any,
  {
    formData: FormData;
  },
  {state: RootReduxState; rejectValue: FetchResponseError}
>(
  'authentication/userAddress',
  async ({formData}, {dispatch, rejectWithValue}) => {
    const {errors, data} = await dispatch(
      fetchAction<TokenPayload>(
        {
          url: API.ADD_ADDRESS,
          method: 'POST',
          data: formData,
          headers: {
            'content-type': 'multipart/form-data',
          },
        },
        true,
      ),
    );

    if (errors) {
      return rejectWithValue(errors);
    }

    if (data?.authorization) {
      dispatch(setUserData(data?.user));
      setData(USER_DATA, data?.user);
      await setData(secureStoreKeys.JWT_TOKEN, data?.authorization.token);
    }

    return data;
  },
);
// Add KYC
export const userVerifyId = createAsyncThunk<
  any,
  {
    formData: FormData;
  },
  {state: RootReduxState; rejectValue: FetchResponseError}
>(
  'authentication/userVerifyId',
  async ({formData}, {dispatch, rejectWithValue}) => {
    const {errors, data} = await dispatch(
      fetchAction<TokenPayload>(
        {
          url: API.VERIFY_KYC,
          method: 'POST',
          data: formData,
          headers: {
            'content-type': 'multipart/form-data',
          },
        },
        true,
      ),
    );

    if (errors) {
      return rejectWithValue(errors);
    }

    if (data?.authorization) {
      dispatch(setUserData(data?.user));
      setData(USER_DATA, data?.user);
      await setData(secureStoreKeys.JWT_TOKEN, data?.authorization.token);
    }

    return data;
  },
);
