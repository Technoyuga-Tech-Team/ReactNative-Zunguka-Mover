import {QueryKey, useQuery, UseQueryOptions} from 'react-query';
import {getUserData} from '../types/user.types';
import {fetch} from '../store/fetch';
import {QueryKeys} from '../constant/queryKeys';
import {API} from '../constant/apiEndpoints';

export const useMeQuery = (
  options?: UseQueryOptions<getUserData, unknown, getUserData, QueryKey>,
) => {
  return useQuery(
    QueryKeys.ME,
    async () => {
      const {data, errors, statusCode} = await fetch<getUserData>({
        url: API.ME,
        method: 'GET',
      });

      if (errors) {
        if (statusCode === 401) {
          return null;
        }
        throw new Error(errors.message);
      }

      return data;
    },
    options,
  );
};
