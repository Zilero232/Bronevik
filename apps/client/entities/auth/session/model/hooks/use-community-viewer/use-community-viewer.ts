'use client';

import { useAuthSession } from '../use-auth-session';
import { useLinkedAccounts } from '../use-linked-accounts';

export const useCommunityViewer = () => {
  const session = useAuthSession();
  const userId = session.data?.user.id ?? null;
  const linked = useLinkedAccounts({ enabled: userId !== null });

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
