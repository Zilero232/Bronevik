'use client';

import type { PlayerSearchResult } from '@bronevik/schemas';

import { useDebounceValue } from '@siberiacancode/reactuse';
import { useQuery } from '@tanstack/react-query';

import { search } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

import { PLAYER_LOOKUP } from '../../config';

export const usePlayerSuggestions = (input: string) => {
  const query = useDebounceValue(input.trim(), PLAYER_LOOKUP.debounceMs);

  const { data: players = [], isFetching } = useQuery({
    queryKey: QUERY_KEYS.search(query),
    queryFn: ({ signal }) => search({ query, signal }),
    enabled: query.length > 0,
    select: ({ results }) => results.filter((result): result is PlayerSearchResult => result.kind === 'player').slice(0, PLAYER_LOOKUP.suggestions)
  });

  return { players: query ? players : [], isFetching };
};
