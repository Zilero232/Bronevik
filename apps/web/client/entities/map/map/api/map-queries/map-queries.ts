import { queryOptions } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants';

import { localizedMap } from '../../lib/localized-map';
import { listMaps } from '../maps';

const list = () =>
  queryOptions({
    queryKey: QUERY_KEYS.maps.list,
    queryFn: ({ signal }) => listMaps({ signal })
  });

export const mapQueries = {
  list,
  localizedList: (locale: string) =>
    queryOptions({
      ...list(),
      select: (maps) => maps.map((map) => localizedMap({ map, locale }))
    })
};
