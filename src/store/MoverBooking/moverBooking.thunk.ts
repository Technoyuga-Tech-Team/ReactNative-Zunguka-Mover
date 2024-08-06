import { createAsyncThunk } from "@reduxjs/toolkit";
import { TokenPayload1 } from "../../types/authentication.types";
import { RootReduxState } from "../../types/store.types";
import { FetchResponseError } from "../../types/fetch.types";
import { fetchAction } from "../fetch";
import { API } from "../../constant/apiEndpoints";

export const addPackageDetails = createAsyncThunk<
  any,
  {
    order_id: number;
    user_id: number;
    item_id: number;
    mover_id: number;
    item_name: string;
    item_size: string;
    receiver_name: string;
    pickup_point_address: string;
    pickup_point_lat: number;
    pickup_point_lng: number;
    delivery_point_address: string;
    delivery_point_lat: number;
    delivery_point_lng: number;
    package_delivery_date: string;
    package_delivery_time: string;
    current_address: string;
    mover_price: string;
  },
  { state: RootReduxState; rejectValue: FetchResponseError }
>(
  "moverBooking/addPackageDetails",
  async (
    {
      order_id,
      user_id,
      mover_id,
      item_id,
      item_name,
      item_size,
      receiver_name,
      pickup_point_address,
      pickup_point_lat,
      pickup_point_lng,
      delivery_point_address,
      delivery_point_lat,
      delivery_point_lng,
      package_delivery_date,
      package_delivery_time,
      current_address,
      mover_price,
    },
    { dispatch, rejectWithValue }
  ) => {
    const { errors, data } = await dispatch(
      fetchAction<TokenPayload1>(
        {
          url: API.ADD_PACKAGE_INFO,
          method: "POST",
          data: {
            order_id,
            user_id,
            mover_id,
            item_id,
            item_name,
            item_size,
            receiver_name,
            pickup_point_address,
            pickup_point_lat,
            pickup_point_lng,
            delivery_point_address,
            delivery_point_lat,
            delivery_point_lng,
            package_delivery_date,
            package_delivery_time,
            current_address,
            mover_price,
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

export const moverRequestedDetails = createAsyncThunk<
  any,
  {
    status: string;
  },
  { state: RootReduxState; rejectValue: FetchResponseError }
>(
  "moverBooking/moverRequestedDetails",
  async ({ status }, { dispatch, rejectWithValue }) => {
    const { errors, data } = await dispatch(
      fetchAction<TokenPayload1>(
        {
          url: API.GET_MOVER_REQUESTED,
          method: "POST",
          data: {
            status,
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

export const approveRejectMoverRequeste = createAsyncThunk<
  any,
  {
    id: number;
    status: "confirmed" | "cancelled" | "startjob" | "endjob";
  },
  { state: RootReduxState; rejectValue: FetchResponseError }
>(
  "moverBooking/approveRejectMoverRequeste",
  async ({ id, status }, { dispatch, rejectWithValue }) => {
    const { errors, data } = await dispatch(
      fetchAction<TokenPayload1>(
        {
          url: API.REJECT_MOVER_REQUESTE,
          method: "POST",
          data: {
            id,
            status,
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

export const deliveryDetailsWithOTP = createAsyncThunk<
  any,
  {
    package_details_id: string;
  },
  { state: RootReduxState; rejectValue: FetchResponseError }
>(
  "moverBooking/deliveryDetailsWithOTP",
  async ({ package_details_id }, { dispatch, rejectWithValue }) => {
    const { errors, data } = await dispatch(
      fetchAction<TokenPayload1>(
        {
          url: API.GET_DELIVERY_DETAILS,
          method: "POST",
          data: {
            package_details_id,
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

export const orderDetails = createAsyncThunk<
  any,
  {
    package_details_id: string;
  },
  { state: RootReduxState; rejectValue: FetchResponseError }
>(
  "moverBooking/orderDetails",
  async ({ package_details_id }, { dispatch, rejectWithValue }) => {
    const { errors, data } = await dispatch(
      fetchAction<TokenPayload1>(
        {
          url: API.GET_ORDER_DETAILS,
          method: "POST",
          data: {
            package_details_id,
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

export const verifyOTPAndEndJob = createAsyncThunk<
  any,
  {
    package_details_id: string;
    otp: string;
    status: string;
  },
  { state: RootReduxState; rejectValue: FetchResponseError }
>(
  "moverBooking/verifyOTPAndEndJob",
  async (
    { otp, package_details_id, status },
    { dispatch, rejectWithValue }
  ) => {
    const { errors, data } = await dispatch(
      fetchAction<TokenPayload1>(
        {
          url: API.END_JOB,
          method: "POST",
          data: {
            package_details_id,
            otp,
            status,
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

export const getPastMoverHistory = createAsyncThunk<
  any,
  {
    limit: number;
    offset: number;
    status: string;
  },
  { state: RootReduxState; rejectValue: FetchResponseError }
>(
  "moverBooking/getPastMoverHistory",
  async ({ limit, offset, status }, { dispatch, rejectWithValue }) => {
    const { errors, data } = await dispatch(
      fetchAction<TokenPayload1>(
        {
          url: `${API.GET_PAST_MOVER_HISTORY}?limit=${limit}&offset=${offset}`,
          method: "POST",
          data: {
            status,
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

export const getMoverRatingHistory = createAsyncThunk<
  any,
  {
    limit: number;
    offset: number;
  },
  { state: RootReduxState; rejectValue: FetchResponseError }
>(
  "moverBooking/getMoverRatingHistory",
  async ({ limit, offset }, { dispatch, rejectWithValue }) => {
    const { errors, data } = await dispatch(
      fetchAction<TokenPayload1>(
        {
          url: `${API.GET_MOVER_RATING_HISTORY}?limit=${limit}&offset=${offset}`,
          method: "POST",
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

export const addRating = createAsyncThunk<
  any,
  {
    mover_id: string;
    rate: number;
    comment: string;
    package_details_id: string;
  },
  { state: RootReduxState; rejectValue: FetchResponseError }
>(
  "moverBooking/getPastMoverHistory",
  async (
    { mover_id, rate, comment, package_details_id },
    { dispatch, rejectWithValue }
  ) => {
    const { errors, data } = await dispatch(
      fetchAction<TokenPayload1>(
        {
          url: API.ADD_RATING,
          method: "POST",
          data: {
            mover_id,
            rate,
            comment,
            package_details_id,
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
