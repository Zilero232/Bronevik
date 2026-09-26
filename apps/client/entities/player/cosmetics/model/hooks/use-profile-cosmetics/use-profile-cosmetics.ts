'use client';

import { useQuery } from '@tanstack/react-query';

import { getProfileCosmetics } from '../../../api';
import { QUERY_KEYS } from '@/shared/constants';

import { PROFILE_COSMETICS_QUERY } from '../../../config';

export const useProfileCosmetics = (accountId: number) =>
  useQuery({
    queryKey: QUERY_KEYS.cosmetics.profile(accountId),
    queryFn: () => getProfileCosmetics(accountId),
    staleTime: PROFILE_COSMETICS_QUERY.staleMs
  });
