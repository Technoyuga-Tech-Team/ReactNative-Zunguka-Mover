import { UseQueryOptions, useQuery } from "react-query";
import { fetch } from "../store/fetch";
import { PayoutHistoryState } from "../types/myEarning.types";
import { QueryKeys } from "../constant/queryKeys";
import { API } from "../constant/apiEndpoints";

export const useGetPayoutHistory = (
  limit: string,
  offset: string,
  options?: UseQueryOptions<
    PayoutHistoryState,
    unknown,
    PayoutHistoryState,
    string[]
  >
) => {
  return useQuery(
    [QueryKeys.PAYOUT_HISTORY, limit, offset],
    // @ts-ignore
    async () => {
      const { data, errors } = await fetch<PayoutHistoryState>({
        url: `${API.GET_PAYOUT_HISTORY}?limit=${limit}&offset=${offset}`,
        method: "GET",
      });

      if (errors) {
        throw new Error(errors.message);
      }

      return data;
    },
    options
  );
};
