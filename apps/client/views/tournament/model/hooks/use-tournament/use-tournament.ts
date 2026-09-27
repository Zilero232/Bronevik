'use client';

import { useQuery } from '@tanstack/react-query';

import { getTournament } from '@/entities/tournament/tournament';
import { isNotFoundError } from '@/shared/api/source';
import { QUERY_KEYS } from '@/shared/constants';

export const useTournament = (slug: string) =>
  useQuery({
    queryKey: QUERY_KEYS.tournaments.detail(slug),
    queryFn: ({ signal }) => getTournament({ slug, signal }),
    retry: (count, failure) => !isNotFoundError(failure) && count < 2
  });
