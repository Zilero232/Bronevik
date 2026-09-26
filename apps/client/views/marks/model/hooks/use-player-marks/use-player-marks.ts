'use client';

import { useQuery } from '@tanstack/react-query';

import { closestMarks } from '@/entities/player/marks';
import { getPlayerMarks } from '@/entities/player/profile';
import { search } from '@/entities/search/search';
import { QUERY_KEYS } from '@/shared/constants';

import { PLAYER_LOOKUP } from '../../../config';
import { isAccountId, pickPlayer } from '../../../lib/player-pick';

export const usePlayerMarks = (player: string) => {
  const isActive = player.length > 0;
  const isAccount = isAccountId(player);

  const {
    data: found,
    isPending: isSearching,
    isError: isSearchError,
    isFetching: isSearchFetching,
    refetch: refetchSearch
  } = useQuery({
    queryKey: QUERY_KEYS.search(player),
    queryFn: ({ signal }) => search({ query: player, signal }),
    enabled: isActive && !isAccount,
    select: ({ results }) => pickPlayer({ player, results })
  });

  const accountId = isAccount ? Number(player) : (found?.accountId ?? null);

  const {
    data: marks,
    isPending,
    isError,
    isFetching,
    refetch: refetchMarks
  } = useQuery({
    queryKey: QUERY_KEYS.marks.player(accountId ?? 0),
    queryFn: ({ signal }) => getPlayerMarks({ accountId: accountId ?? 0, signal }),
    enabled: accountId !== null,
    select: ({ items }) => closestMarks({ items, limit: PLAYER_LOOKUP.closestLimit })
  });

  const retry = () => {
    if (isSearchError) {
      void refetchSearch();
    }

    if (isError) {
      void refetchMarks();
    }
  };

  return {
    nickname: found?.nickname ?? player,
    marks: marks ?? [],
    hasPlayer: isActive,
    isNotFound: isActive && !isAccount && !isSearching && !isSearchError && found === null,
    isLoading: isActive && ((!isAccount && isSearching) || (accountId !== null && isPending)),
    isError: isSearchError || isError,
    isRetrying: isSearchFetching || isFetching,
    retry
  };
};
