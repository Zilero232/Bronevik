'use client';

import { getMyBattles } from '@/entities/player/analytics';
import { isNotFoundError } from '@/shared/api/source';
import { QUERY_KEYS, ROUTES } from '@/shared/constants';
import { useRouter } from '@/shared/i18n/navigation';
import { useOffsetInfiniteList } from '@/shared/lib';

import { ANALYTICS_VIEW } from '../../../config';
import { useAnalyticsFilters } from '../../context';
import { useMyBattlesColumns } from '../use-my-battles-columns';

export const useMyBattles = () => {
  const router = useRouter();
  const { account } = useAnalyticsFilters();
  const list = useOffsetInfiniteList({
    queryKey: QUERY_KEYS.me.analytics.battles({ account, limit: ANALYTICS_VIEW.battlesPageSize }),
    queryFn: ({ offset, signal }) => getMyBattles({ account, offset, limit: ANALYTICS_VIEW.battlesPageSize, signal })
  });

  const columns = useMyBattlesColumns();

  return {
    ...list,
    columns,
    isNoAccount: list.isError && isNotFoundError(list.error),
    openBattle: (id: string) => router.push(ROUTES.account.battle(id))
  };
};
