'use client';

import { useQuery } from '@tanstack/react-query';

import { useAuthSession } from '@/entities/auth/session';
import { getBillingStatus } from '@/shared/api/billing';
import { QUERY_KEYS } from '@/shared/constants';

export const usePlusAccess = () => {
  const { data: session, isPending: isSessionPending } = useAuthSession();
  const { data: status, isPending: isStatusPending } = useQuery({
    queryKey: QUERY_KEYS.me.billing.status,
    queryFn: getBillingStatus,
    enabled: Boolean(session)
  });

  const isSignedIn = Boolean(session);

  return {
    isSignedIn,
    isPlus: status?.isPlus ?? false,
    isPending: isSessionPending || (isSignedIn && isStatusPending)
  };
};
