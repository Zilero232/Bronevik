import { queryOptions } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants';

import { listMaps } from '../maps';

export const mapQueries = {
  list: () =>
    queryOptions({
      queryKey: QUERY_KEYS.maps.list,
      queryFn: ({ signal }) => listMaps({ signal })
    })
};
