import { createSlice, isAnyOf, PayloadAction } from "@reduxjs/toolkit";
import { LoadingState } from "../../types/global.types";

import { moverPackageStatusDetails } from "./packageStatus.thunk";
import { PackageStatusState } from "../../types/packageStatus.types";

const initialState: PackageStatusState = {
  loading: LoadingState.REMOVE,
};

const packageStatus = createSlice({
  name: "packageStatus",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(isAnyOf(moverPackageStatusDetails.pending), (state) => {
        state.loading = LoadingState.CREATE;
      })
      .addMatcher(
        isAnyOf(
          moverPackageStatusDetails.fulfilled,
          moverPackageStatusDetails.rejected
        ),
        (state) => {
          state.loading = LoadingState.REMOVE;
        }
      );
  },
});

export default packageStatus.reducer;
