import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootReduxState } from "../../types/store.types";
import { FetchResponseError } from "../../types/fetch.types";
import { fetchAction } from "../fetch";
import { TokenPayload1 } from "../../types/authentication.types";
import { API } from "../../constant/apiEndpoints";

// ongoing : startjob. Completed: endjob, Upcomming: completed
export const moverPackageStatusDetails = createAsyncThunk<
  any,
  {
    status: "startjob" | "endjob" | "completed";
    limit: number;
    offset: number;
  },
  { state: RootReduxState; rejectValue: FetchResponseError }
>(
  "moverPackage/moverPackageStatusDetails",
  async ({ status, limit, offset }, { dispatch, rejectWithValue }) => {
    const { errors, data } = await dispatch(
      fetchAction<TokenPayload1>(
        {
          url: API.GET_PACKAGE_STATUS,
          method: "POST",
          data: {
            status,
            limit,
            offset,
          },
        },
        true
      )
    );

    if (errors) {
      return rejectWithValue(errors);
    }

    return data;
  }
);
