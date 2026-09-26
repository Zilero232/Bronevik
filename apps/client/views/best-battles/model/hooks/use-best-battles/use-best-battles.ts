'use client';

import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { getBestBattleFacets, listBestBattles } from '@/entities/battle/best-battle';
import { QUERY_KEYS } from '@/shared/constants';

import { BEST_BATTLES_VIEW } from '../../../config';
import { hasBattleFilters, toBestBattlesQuery } from '../../../lib';
import { useBestBattlesState } from '../use-best-battles-state';

export const useBestBattles = () => {
  const [state, setState] = useBestBattlesState();
  const query = toBestBattlesQuery(state);
  const feed = useInfiniteQuery({
    queryKey: QUERY_KEYS.bestBattles.list(query),
    queryFn: ({ signal, pageParam }) => listBestBattles({ ...query, cursor: pageParam, signal }),
    initialPageParam: String(BEST_BATTLES_VIEW.firstOffset),
    getNextPageParam: (page) => page.nextCursor,
    placeholderData: keepPreviousData,
    staleTime: BEST_BATTLES_VIEW.staleMs
  });

  const facets = useQuery({
    queryKey: QUERY_KEYS.bestBattles.facets(state.period),
    queryFn: ({ signal }) => getBestBattleFacets({ period: state.period, signal }),
    staleTime: BEST_BATTLES_VIEW.staleMs
  });

  const battles = feed.data?.pages.flatMap((page) => page.items) ?? [];

  return {
    metric: state.metric,
    battles,
    podium: battles.slice(0, BEST_BATTLES_VIEW.podiumSize),
    facets: facets.data ?? null,
    isFiltered: hasBattleFilters(state),
    isPending: feed.isPending,
    isError: feed.isError,
    isRefreshing: feed.isPlaceholderData,
    isRetrying: feed.isFetching,
    hasNextPage: feed.hasNextPage,
    isFetchingNextPage: feed.isFetchingNextPage,
    loadMore: () => void feed.fetchNextPage(),
    retry: () => void feed.refetch(),
    reset: () => void setState({ tank: null, map: null, medal: null })
  };
};
