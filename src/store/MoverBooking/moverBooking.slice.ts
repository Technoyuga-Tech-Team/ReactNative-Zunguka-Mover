import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { LoadingState } from "../../types/global.types";
import { MoverBookingState } from "../../types/moverBooking.types";
import {
  addPackageDetails,
  addRating,
  approveRejectMoverRequeste,
  deliveryDetailsWithOTP,
  getMoverRatingHistory,
  getPastMoverHistory,
  moverRequestedDetails,
  orderDetails,
  verifyOTPAndEndJob,
} from "./moverBooking.thunk";

const initialState: MoverBookingState = {
  loading: LoadingState.REMOVE,
};

const moverBooking = createSlice({
  name: "moverBooking",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        isAnyOf(
          addPackageDetails.pending,
          moverRequestedDetails.pending,
          approveRejectMoverRequeste.pending,
          deliveryDetailsWithOTP.pending,
          verifyOTPAndEndJob.pending,
          getPastMoverHistory.pending,
          addRating.pending,
          getMoverRatingHistory.pending,
          orderDetails.pending
        ),
        (state) => {
          state.loading = LoadingState.CREATE;
        }
      )
      .addMatcher(
        isAnyOf(
          addPackageDetails.fulfilled,
          moverRequestedDetails.fulfilled,
          approveRejectMoverRequeste.fulfilled,
          deliveryDetailsWithOTP.fulfilled,
          verifyOTPAndEndJob.fulfilled,
          getPastMoverHistory.fulfilled,
          addRating.fulfilled,
          getMoverRatingHistory.fulfilled,
          orderDetails.fulfilled,
          addPackageDetails.rejected,
          moverRequestedDetails.rejected,
          approveRejectMoverRequeste.rejected,
          deliveryDetailsWithOTP.rejected,
          verifyOTPAndEndJob.rejected,
          getPastMoverHistory.rejected,
          addRating.rejected,
          getMoverRatingHistory.rejected,
          orderDetails.rejected
        ),
        (state) => {
          state.loading = LoadingState.REMOVE;
        }
      );
  },
});

export default moverBooking.reducer;
