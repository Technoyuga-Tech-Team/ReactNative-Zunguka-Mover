import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootReduxState } from "../../types/store.types";
import { FetchResponseError } from "../../types/fetch.types";
import { fetchAction } from "../fetch";
import { TokenPayload1 } from "../../types/authentication.types";
import { API } from "../../constant/apiEndpoints";

export const getMyEarnings = createAsyncThunk<
  any,
  {
    status: string;
    limit: number;
    offset: number;
    start_date: string;
    end_date: string;
  },
  { state: RootReduxState; rejectValue: FetchResponseError }
>(
  "myEarning/getMyEarnings",
  async (
    { status, limit, offset, start_date, end_date },
    { dispatch, rejectWithValue }
  ) => {
    const { errors, data } = await dispatch(
      fetchAction<TokenPayload1>(
        {
          url: API.GET_MOVER_EARNING,
          method: "POST",
          data: {
            status,
            limit,
            offset,
            start_date,
            end_date,
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

export const sendPayoutRequest = createAsyncThunk<
  any,
  {
    amount: string;
  },
  { state: RootReduxState; rejectValue: FetchResponseError }
>(
  "myEarning/sendPayoutRequest",
  async ({ amount }, { dispatch, rejectWithValue }) => {
    const { errors, data } = await dispatch(
      fetchAction<TokenPayload1>(
        {
          url: API.SEND_PAYOUT_REQUEST,
          method: "POST",
          data: {
            amount,
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
