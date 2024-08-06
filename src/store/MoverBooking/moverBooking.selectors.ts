import { createSelector } from "@reduxjs/toolkit";
import { RootReduxState } from "../../types/store.types";

const selectMoverBookingState = (state: RootReduxState) => state.moverBooking;

export const selectMoverBookingLoading = createSelector(
  [selectMoverBookingState],
  (moverBooking) => moverBooking?.loading
);
