import { createSelector } from "@reduxjs/toolkit";
import { RootReduxState } from "../../types/store.types";

const selectNotificationStatusState = (state: RootReduxState) =>
  state.notification;

export const selectNotificationLoading = createSelector(
  [selectNotificationStatusState],
  (notification) => notification?.loading
);
