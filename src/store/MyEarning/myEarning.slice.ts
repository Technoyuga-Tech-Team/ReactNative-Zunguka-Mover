import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { LoadingState } from "../../types/global.types";
import { getMyEarnings, sendPayoutRequest } from "./myEarning.thunk";
import { MyEarningState } from "../../types/myEarning.types";

const initialState: MyEarningState = {
  loading: LoadingState.REMOVE,
};

const myEarning = createSlice({
  name: "myEarning",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        isAnyOf(getMyEarnings.pending, sendPayoutRequest.pending),
        (state) => {
          state.loading = LoadingState.CREATE;
        }
      )
      .addMatcher(
        isAnyOf(
          getMyEarnings.fulfilled,
          sendPayoutRequest.fulfilled,
          getMyEarnings.rejected,
          sendPayoutRequest.rejected
        ),
        (state) => {
          state.loading = LoadingState.REMOVE;
        }
      );
  },
});

export default myEarning.reducer;
