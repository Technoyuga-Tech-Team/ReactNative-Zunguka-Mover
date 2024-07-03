import { createSelector } from "@reduxjs/toolkit";
import { RootReduxState } from "../../types/store.types";

const selectAuthenticationState = (state: RootReduxState) =>
  state.authentication;

export const selectAuthenticationLoading = createSelector(
  [selectAuthenticationState],
  (authentication) => authentication.loading
);

export const selectOAuthLoading = createSelector(
  [selectAuthenticationState],
  (authentication) => authentication.oAuthLoading
);
