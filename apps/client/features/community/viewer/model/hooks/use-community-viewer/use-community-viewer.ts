'use client';

import { useQuery } from '@tanstack/react-query';

import { getLinkedAccounts, useAuthSession } from '@/entities/auth/session';
import { QUERY_KEYS } from '@/shared/constants';

export const useCommunityViewer = () => {
  const session = useAuthSession();
  const userId = session.data?.user.id ?? null;
  const linked = useQuery({ queryKey: QUERY_KEYS.me.section('accounts'), queryFn: getLinkedAccounts, enabled: userId !== null });

  const accounts = linked.data?.lesta ?? [];
  const accountIds = new Set(accounts.map(({ accountId }) => accountId));

  return {
    userId,
    accounts,
    isSignedIn: userId !== null,
    hasLesta: accounts.length > 0,
    isPending: session.isPending || (userId !== null && linked.isPending),
    ownsAccount: (accountId: number | null) => accountId !== null && accountIds.has(accountId)
  };
};
