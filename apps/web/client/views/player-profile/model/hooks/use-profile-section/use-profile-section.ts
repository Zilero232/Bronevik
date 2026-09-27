'use client';

import type { QueryFunctionContext } from '@tanstack/react-query';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants';

import type { UseProfileSectionInput } from './use-profile-section.types';

import { useProfileContext } from '../../context';

export const useProfileSection = <T>({ section, params, fetcher }: UseProfileSectionInput<T>) => {
  const { accountId } = useProfileContext();

  return useQuery({
    queryKey: QUERY_KEYS.player.section({ accountId, section, params }),
    queryFn: ({ signal }: QueryFunctionContext) => fetcher({ accountId, signal }),
    placeholderData: keepPreviousData
  });
};
