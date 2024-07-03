import { createSelector } from "@reduxjs/toolkit";
import { RootReduxState } from "../../types/store.types";

const selectUserProfileState = (state: RootReduxState) => state.userProfile;

export const selectUserProfileLoading = createSelector(
  [selectUserProfileState],
  (userProfile) => userProfile.loading
);
