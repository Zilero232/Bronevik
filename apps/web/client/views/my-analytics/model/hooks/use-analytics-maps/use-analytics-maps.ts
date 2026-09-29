'use client';

import { useTranslations } from 'next-intl';

import { useMapLabels, useMapNameOf } from '@/entities/map/map';
import { getAnalyticsMaps } from '@/entities/player/analytics';
import { QUERY_KEYS } from '@/shared/constants';

import { useAnalyticsFilters } from '../../context';
import { useAnalyticsQuery } from '../use-analytics-query';
import { useMapRowsColumns } from '../use-map-rows-columns';
import { useMapsColumns } from '../use-maps-columns';

export const useAnalyticsMaps = () => {
  const t = useTranslations('analytics.maps');
  const labels = useMapLabels();
  const mapNameOf = useMapNameOf();
  const { account, period } = useAnalyticsFilters();
  const { data, status, isRetrying, retry } = useAnalyticsQuery({
    queryKey: QUERY_KEYS.me.analytics.maps({ account, period }),
    queryFn: ({ signal }) => getAnalyticsMaps({ account, period, signal }),
    requiresPlus: true
  });

  const mapsColumns = useMapsColumns();
  const rowsColumns = useMapRowsColumns();

  const names = new Map((data?.maps ?? []).map((map) => [map.arenaId, labels.name(map.name)]));
  const nameOf = (arenaId: string) => mapNameOf(arenaId) ?? names.get(arenaId) ?? labels.name(null);

  return {
    data,
    status,
    isRetrying,
    retry,
    isEmpty: (data?.totals.battles ?? 0) === 0,
    mapsColumns,
    rowsColumns,
    rows: (data?.rows ?? []).map((row) => ({ ...row, mapName: nameOf(row.arenaId) })),
    weakMaps: (data?.weakMaps ?? []).map(nameOf),
    strongMaps: (data?.strongMaps ?? []).map(nameOf),
    listText: (items: string[]) => (items.length > 0 ? items.join(', ') : t('none'))
  };
};
