import type { StreamerSettingsView } from '@otmetki/schemas';

import { keepPreviousData, queryOptions } from '@tanstack/react-query';

import { streamersControllerCompareSettings } from '@/shared/api/generated';
import { fromSdk } from '@/shared/api/source';
import { QUERY_KEYS } from '@/shared/constants';

export const compareStreamerSettings = (slugs: readonly string[]): Promise<StreamerSettingsView[]> =>
  fromSdk(() => streamersControllerCompareSettings({ query: { slugs: slugs.join(',') } }));

export const settingsCompareQueries = {
  bySlugs: (slugs: readonly string[]) =>
    queryOptions({
      queryKey: QUERY_KEYS.streamers.settingsCompare(slugs),
      queryFn: () => compareStreamerSettings(slugs),
      enabled: slugs.length > 0,
      placeholderData: keepPreviousData
    })
};
