'use client';

import { PROFILE_COSMETICS } from '@otmetki/schemas';
import { useQuery } from '@tanstack/react-query';
import { indexBy, unique } from 'remeda';

import { getProfilesCosmetics } from '../../../api';
import { QUERY_KEYS } from '@/shared/constants';

import { PROFILE_COSMETICS_QUERY } from '../../../config';

export const useProfilesCosmetics = (accountIds: readonly number[]) => {
  const ids = unique(accountIds).slice(0, PROFILE_COSMETICS.maxBatch);
  const { data } = useQuery({
    queryKey: QUERY_KEYS.cosmetics.profiles(ids),
    queryFn: () => getProfilesCosmetics(ids),
    enabled: ids.length > 0,
    staleTime: PROFILE_COSMETICS_QUERY.staleMs
  });

  return indexBy(data ?? [], (item) => item.accountId);
};
