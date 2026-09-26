'use client';

import { useQuery } from '@tanstack/react-query';

import { getLinkedAccounts } from '@/entities/auth/session';
import { isUnauthorizedError } from '@/shared/api/source';
import { QUERY_KEYS } from '@/shared/constants';

import { primaryAccount } from '../../../lib/dashboard-picks';

export const useMiniDashboard = () => {
  const {
    data: accounts,
    isPending,
    error,
    isFetching,
    refetch
  } = useQuery({
    queryKey: QUERY_KEYS.me.section('accounts'),
    queryFn: getLinkedAccounts
  });

  return {
    account: primaryAccount(accounts?.lesta ?? []),
    isPending,
    isFailed: Boolean(error) && !isUnauthorizedError(error),
    isRetrying: isFetching,
    retry: () => void refetch()
  };
};
