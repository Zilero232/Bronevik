'use client';

import { useQuery } from '@tanstack/react-query';

import { useAuthSession } from '@/entities/auth/session';
import { vehicleIndex } from '@/entities/tank/tank';
import { useVehicleCatalog } from '@/features/tank/pick-tank';
import { QUERY_KEYS } from '@/shared/constants';

import { getSocialFeed } from '../../../api';
import { FEED_VIEW } from '../../../config';
import { feedSummary, filterFeed, groupFeedByDay } from '../../../lib/feed-groups';
import { useFeedFilters } from '../use-feed-filters';

export const useSocialFeed = () => {
  const session = useAuthSession();
  const filters = useFeedFilters();
  const { data: catalog } = useVehicleCatalog();
  const query = useQuery({
    queryKey: QUERY_KEYS.social.feed({ days: filters.days }),
    queryFn: ({ signal }) => getSocialFeed({ days: Number(filters.days), signal }),
    enabled: Boolean(session.data),
    staleTime: FEED_VIEW.staleMs
  });

  const items = query.data?.items ?? [];
  const visible = filterFeed({ items, kind: filters.kind });

  return {
    query,
    filters,
    days: groupFeedByDay({ items: visible }),
    isFiltered: filters.kind !== 'all' && items.length > 0,
    summary: query.data ? feedSummary(items) : null,
    vehicles: vehicleIndex(catalog)
  };
};
