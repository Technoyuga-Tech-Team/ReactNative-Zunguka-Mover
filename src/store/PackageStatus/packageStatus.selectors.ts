import { createSelector } from "@reduxjs/toolkit";
import { RootReduxState } from "../../types/store.types";

const selectPackageStatusState = (state: RootReduxState) => state.packageStatus;

export const selectPackageStatusLoading = createSelector(
  [selectPackageStatusState],
  (packageStatus) => packageStatus?.loading
);
