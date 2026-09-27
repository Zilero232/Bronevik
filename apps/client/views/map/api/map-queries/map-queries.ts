import { queryOptions } from '@tanstack/react-query';

import { getMap } from '@/entities/map/map';
import { QUERY_KEYS } from '@/shared/constants';

export const mapQueries = {
  detail: (idOrSlug: string) =>
    queryOptions({
      queryKey: QUERY_KEYS.maps.detail(idOrSlug),
      queryFn: ({ signal }) => getMap({ idOrSlug, signal })
    })
};
