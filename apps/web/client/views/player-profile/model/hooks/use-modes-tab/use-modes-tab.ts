'use client';

import { useQuery } from '@tanstack/react-query';

import { playersControllerModesOptions } from '@/shared/api/query-options';

import { useProfileContext } from '../../context';

export const useModesTab = () => {
  const { accountId } = useProfileContext();
  const query = useQuery(playersControllerModesOptions({ path: { id: accountId } }));

  return { query, source: query.data?.source ?? null };
};
