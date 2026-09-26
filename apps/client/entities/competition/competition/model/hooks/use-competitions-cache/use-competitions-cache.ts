'use client';

import type { Competition } from '@otmetki/schemas';

import { useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants';

export const useCompetitionsCache = () => {
  const queryClient = useQueryClient();

  const storeDetail = (competition: Competition) =>
    queryClient.setQueriesData<Competition>({ queryKey: QUERY_KEYS.competitions.detail({ slug: competition.slug }) }, competition);

  const invalidateLists = () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.competitions.list({}) });

  const forgetDetail = (slug: string) => queryClient.removeQueries({ queryKey: QUERY_KEYS.competitions.detail({ slug }) });

  return { storeDetail, invalidateLists, forgetDetail };
};
