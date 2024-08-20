import { createSelector } from "@reduxjs/toolkit";
import { RootReduxState } from "../../types/store.types";

const selectMyEarningState = (state: RootReduxState) => state.myEarning;

export const selectMyEarningLoading = createSelector(
  [selectMyEarningState],
  (earning) => earning?.loading
);
