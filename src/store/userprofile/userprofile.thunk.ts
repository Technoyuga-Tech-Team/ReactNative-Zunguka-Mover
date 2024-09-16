import { createAsyncThunk } from "@reduxjs/toolkit";
import { TokenPayload1 } from "../../types/authentication.types";
import { RootReduxState } from "../../types/store.types";
import { FetchResponseError } from "../../types/fetch.types";
import { fetchAction } from "../fetch";
import { API } from "../../constant/apiEndpoints";

export const userSetupProfile = createAsyncThunk<
  any,
  { formData: FormData },
  { state: RootReduxState; rejectValue: FetchResponseError }
>(
  "user/userSetupProfile",
  async ({ formData }, { dispatch, rejectWithValue }) => {
    const { errors, data } = await dispatch(
      fetchAction<TokenPayload1>(
        {
          url: API.SETUP_PROFILE,
          method: "POST",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
        true
      )
    );

    if (errors) {
      return rejectWithValue(errors);
    }

    return data;
  }
);

export const userUpdateProfilePicture = createAsyncThunk<
  any,
  { formData: FormData },
  { state: RootReduxState; rejectValue: FetchResponseError }
>(
  "user/userUpdateProfilePicture",
  async ({ formData }, { dispatch, rejectWithValue }) => {
    const { errors, data } = await dispatch(
      fetchAction<TokenPayload1>(
        {
          url: API.UPDATE_PROFILE_PICTURE,
          method: "POST",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
        true
      )
    );

    if (errors) {
      return rejectWithValue(errors);
    }

    return data;
  }
);

export const userUpdateProfile = createAsyncThunk<
  any,
  {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    phone_number: string;
  },
  { state: RootReduxState; rejectValue: FetchResponseError }
>(
  "user/userUpdateProfile",
  async (
    { first_name, last_name, username, email, phone_number },
    { dispatch, rejectWithValue }
  ) => {
    const { errors, data } = await dispatch(
      fetchAction<TokenPayload1>(
        {
          url: API.UPDATE_PROFILE,
          method: "POST",
          data: { first_name, last_name, username, email, phone_number },
        },
        true
      )
    );

    if (errors) {
      return rejectWithValue(errors);
    }

    return data;
  }
);

export const updateNotificationProfile = createAsyncThunk<
  any,
  {
    push_notification: number;
    new_message: number;
    new_items: number;
    purchase_item: number;
  },
  { state: RootReduxState; rejectValue: FetchResponseError }
>(
  "user/updateNotificationProfile",
  async (
    { push_notification, new_message, new_items, purchase_item },
    { dispatch, rejectWithValue }
  ) => {
    const { errors, data } = await dispatch(
      fetchAction<TokenPayload1>(
        {
          url: API.UPDATE_NOTIFICATION,
          method: "POST",
          data: { push_notification, new_message, new_items, purchase_item },
        },
        true
      )
    );

    if (errors) {
      return rejectWithValue(errors);
    }

    return data;
  }
);

export const deleteAccount = createAsyncThunk<
  any,
  {},
  { state: RootReduxState; rejectValue: FetchResponseError }
>("user/deleteAccount", async ({}, { dispatch, rejectWithValue }) => {
  const { errors, data } = await dispatch(
    fetchAction<TokenPayload1>(
      {
        url: API.DELETE_ACCOUNT,
        method: "DELETE",
      },
      true
    )
  );

  if (errors) {
    return rejectWithValue(errors);
  }

  return data;
});
