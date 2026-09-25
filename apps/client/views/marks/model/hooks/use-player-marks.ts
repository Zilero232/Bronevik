'use client';

import type { PlayerSearchResult } from '@bronevik/schemas';

import { useQuery } from '@tanstack/react-query';

import { search } from '@/shared/api';
import { getPlayerMarks } from '@/shared/api/players';
import { QUERY_KEYS } from '@/shared/constants';

import { closestMarks } from '../../lib/closest-marks';

const ACCOUNT_ID = /^\d+$/;

type PickPlayerInput = {
  player: string;
  results: PlayerSearchResult[];
};

const pickPlayer = ({ player, results }: PickPlayerInput) =>
  results.find(({ nickname }) => nickname.toLowerCase() === player.toLowerCase()) ?? results.at(0) ?? null;

export const usePlayerMarks = (player: string) => {
  const isActive = player.length > 0;
  const isAccountId = ACCOUNT_ID.test(player);

  const {
    data: found,
    isPending: isSearching,
    isError: isSearchError
  } = useQuery({
    queryKey: QUERY_KEYS.search(player),
    queryFn: ({ signal }) => search({ query: player, signal }),
    enabled: isActive && !isAccountId,
    select: ({ results }) => pickPlayer({ player, results: results.filter((result): result is PlayerSearchResult => result.kind === 'player') })
  });

  const accountId = isAccountId ? Number(player) : (found?.accountId ?? null);

  const {
    data: marks,
    isPending,
    isError
  } = useQuery({
    queryKey: QUERY_KEYS.marks.player(accountId ?? 0),
    queryFn: ({ signal }) => getPlayerMarks({ accountId: accountId ?? 0, signal }),
    enabled: accountId !== null,
    select: ({ items }) => closestMarks(items)
  });

  return {
    nickname: found?.nickname ?? player,
    marks: marks ?? [],
    isNotFound: isActive && !isAccountId && !isSearching && !isSearchError && found === null,
    isLoading: isActive && ((!isAccountId && isSearching) || (accountId !== null && isPending)),
    isError: isSearchError || isError
  };
};
