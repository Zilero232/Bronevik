'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { match } from 'ts-pattern';

import { useCommunityViewer } from '@/features/community/viewer';
import { listMyReplays, listReplays } from '@/shared/api/replays';
import { QUERY_KEYS } from '@/shared/constants';

import { REPLAY_LIST } from '../../../config';
import { hasActiveFilters, pageWindow, toSearchQuery } from '../../../lib/replay-query';
import { useReplayFilters } from '../use-replay-filters';

export const useReplaysFeed = () => {
  const { tab, filters, setTab, setOffset, reset } = useReplayFilters();
  const { isSignedIn } = useCommunityViewer();
  const activeTab = isSignedIn ? tab : REPLAY_LIST.defaultTab;
  const isMine = activeTab === 'mine';
  const query = toSearchQuery({ filters, limit: REPLAY_LIST.pageSize });
  const page = { limit: REPLAY_LIST.pageSize, offset: query.offset ?? 0 };

  const { data, isPending, isError, isFetching, refetch } = useQuery({
    queryKey: isMine ? QUERY_KEYS.replays.mine(page) : QUERY_KEYS.replays.list(query),
    queryFn: ({ signal }) => (isMine ? listMyReplays({ ...page, signal }) : listReplays({ ...query, signal })),
    placeholderData: keepPreviousData
  });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const pager = pageWindow({ offset: page.offset, limit: page.limit, total });
  const isFiltered = !isMine && hasActiveFilters(filters);
  const empty = match({ isMine, isFiltered })
    .with({ isMine: true }, () => ({ title: 'emptyMineTitle', description: 'emptyMineDescription' }) as const)
    .with({ isFiltered: true }, () => ({ title: 'emptyTitle', description: 'emptyFilteredDescription' }) as const)
    .otherwise(() => ({ title: 'emptyTitle', description: 'emptyDescription' }) as const);

  return {
    tab: activeTab,
    isSignedIn,
    isMine,
    items,
    total,
    pager,
    isFiltered,
    empty,
    isPending,
    isError,
    isFetching,
    setTab,
    resetFilters: reset,
    goPrev: () => setOffset(pager.prevOffset ?? 0),
    goNext: () => setOffset(pager.nextOffset ?? page.offset),
    retry: () => void refetch()
  };
};
