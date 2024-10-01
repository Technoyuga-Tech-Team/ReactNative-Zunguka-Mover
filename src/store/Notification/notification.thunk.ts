import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootReduxState } from "../../types/store.types";
import { FetchResponseError } from "../../types/fetch.types";
import { fetchAction } from "../fetch";
import { TokenPayload1 } from "../../types/authentication.types";
import { API } from "../../constant/apiEndpoints";

export const readUnreadNotification = createAsyncThunk<
  any,
  {
    notification_id: string;
  },
  { state: RootReduxState; rejectValue: FetchResponseError }
>(
  "notification/readUnreadNotification",
  async ({ notification_id }, { dispatch, rejectWithValue }) => {
    const { errors, data } = await dispatch(
      fetchAction<TokenPayload1>(
        {
          url: API.READ_UNREAD_NOTIFICATION,
          method: "POST",
          data: {
            notification_id,
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

export const readUnreadAlert = createAsyncThunk<
  any,
  {
    alert_id: string;
  },
  { state: RootReduxState; rejectValue: FetchResponseError }
>(
  "notification/readUnreadAlert",
  async ({ alert_id }, { dispatch, rejectWithValue }) => {
    const { errors, data } = await dispatch(
      fetchAction<TokenPayload1>(
        {
          url: API.READ_UNREAD_ALERT,
          method: "POST",
          data: {
            alert_id,
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
