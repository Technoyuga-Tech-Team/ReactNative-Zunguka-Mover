import { createSlice, isAnyOf, PayloadAction } from "@reduxjs/toolkit";

import { LoadingState } from "../../types/global.types";
import { UserProfileState } from "../../types/user.types";
import {
  deleteAccount,
  updateNotificationProfile,
  userContactUs,
  userSetupProfile,
  userUpdateProfile,
  userUpdateProfilePicture,
} from "./userprofile.thunk";

const initialState: UserProfileState = {
  loading: LoadingState.REMOVE,
};

const userprofile = createSlice({
  name: "userprofile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        isAnyOf(
          userUpdateProfilePicture.pending,
          userUpdateProfile.pending,
          updateNotificationProfile.pending,
          userSetupProfile.pending,
          deleteAccount.pending,
          userContactUs.pending
        ),
        (state) => {
          state.loading = LoadingState.CREATE;
        }
      )
      .addMatcher(
        isAnyOf(
          userUpdateProfilePicture.fulfilled,
          userUpdateProfile.fulfilled,
          updateNotificationProfile.fulfilled,
          userSetupProfile.fulfilled,
          deleteAccount.fulfilled,
          userContactUs.fulfilled,
          userUpdateProfilePicture.rejected,
          userUpdateProfile.rejected,
          updateNotificationProfile.rejected,
          userSetupProfile.rejected,
          deleteAccount.rejected,
          userContactUs.rejected
        ),
        (state) => {
          state.loading = LoadingState.REMOVE;
        }
      );
  },
});

export default userprofile.reducer;
