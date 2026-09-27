'use client';

import { useLinkedAccounts } from '@/entities/auth/session';
import { isUnauthorizedError } from '@/shared/api/source';

import { primaryAccount } from '../../../lib/dashboard-picks';

export const useMiniDashboard = () => {
  const { data: accounts, isPending, error, isFetching, refetch } = useLinkedAccounts();

  return {
    account: primaryAccount(accounts?.lesta ?? []),
    isPending,
    isFailed: Boolean(error) && !isUnauthorizedError(error),
    isRetrying: isFetching,
    retry: () => void refetch()
  };
};
