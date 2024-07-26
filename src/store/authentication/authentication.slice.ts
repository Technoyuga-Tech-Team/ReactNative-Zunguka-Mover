import { createSlice, isAnyOf, PayloadAction } from "@reduxjs/toolkit";
import { AuthenticationState } from "../../types/authentication.types";
import { AuthLoadingState, LoadingState } from "../../types/global.types";
import {
  userChangePassword,
  userForgotPassword,
  userLogin,
  userOTPCode,
  userRegistration,
  userResetPassword,
  userSelfieVerification,
  userVerifyId,
} from "./authentication.thunks";

const initialState: AuthenticationState = {
  loading: LoadingState.REMOVE,
  oAuthLoading: AuthLoadingState.NULL,
};

const authentication = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    setOAuthLoading: (
      state: AuthenticationState,
      { payload }: PayloadAction<AuthLoadingState>
    ) => {
      state.oAuthLoading = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        isAnyOf(
          userRegistration.pending,
          userLogin.pending,
          userForgotPassword.pending,
          userChangePassword.pending,
          userOTPCode.pending,
          userResetPassword.pending,
          userVerifyId.pending,
          userSelfieVerification.pending
        ),
        (state) => {
          state.loading = LoadingState.CREATE;
        }
      )
      .addMatcher(
        isAnyOf(
          userLogin.fulfilled,
          userRegistration.fulfilled,
          userForgotPassword.fulfilled,
          userChangePassword.fulfilled,
          userOTPCode.fulfilled,
          userResetPassword.fulfilled,
          userVerifyId.fulfilled,
          userSelfieVerification.fulfilled,
          userLogin.rejected,
          userRegistration.rejected,
          userForgotPassword.rejected,
          userChangePassword.rejected,
          userOTPCode.rejected,
          userResetPassword.rejected,
          userVerifyId.rejected,
          userSelfieVerification.rejected
        ),
        (state) => {
          state.loading = LoadingState.REMOVE;
        }
      );
  },
});

export const { setOAuthLoading } = authentication.actions;

export default authentication.reducer;
