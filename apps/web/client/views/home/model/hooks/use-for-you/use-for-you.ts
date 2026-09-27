'use client';

import { useQuery } from '@tanstack/react-query';

import { useAuthSession, useLinkedAccounts } from '@/entities/auth/session';
import { getFirstWin } from '@/entities/player/analytics';
import { QUERY_KEYS } from '@/shared/constants';

import { HOME } from '../../../config';

export const useForYou = () => {
  const { data: session } = useAuthSession();
  const { data: accounts } = useLinkedAccounts({ enabled: Boolean(session) });
  const lesta = accounts?.lesta ?? [];
  const primary = lesta.find(({ isPrimary }) => isPrimary) ?? lesta[0] ?? null;
  const { data: firstWin } = useQuery({
    queryKey: QUERY_KEYS.me.analytics.firstWin({ account: undefined }),
    queryFn: ({ signal }) => getFirstWin({ signal }),
    enabled: primary !== null,
    staleTime: HOME.staleMs
  });

  return {
    isVisible: Boolean(session),
    nickname: primary?.nickname ?? null,
    firstWin: firstWin?.state === 'ready' ? { available: firstWin.available, taken: firstWin.taken } : null
  };
};
