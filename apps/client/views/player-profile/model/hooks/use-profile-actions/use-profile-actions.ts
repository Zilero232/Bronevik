'use client';

import { useAuthSession } from '@/entities/auth/session';
import { ROUTES } from '@/shared/constants';
import { useClientNow } from '@/shared/lib';

import { useProfileContext } from '../../context';
import { useProfileShare } from '../use-profile-share';

export const useProfileActions = () => {
  const { accountId, nickname } = useProfileContext();
  const { data: session } = useAuthSession();
  const { copied, share } = useProfileShare();
  const now = useClientNow();

  return {
    accountId,
    copied,
    share,
    signatureHref: ROUTES.players.signature(nickname),
    wrappedHref: now ? ROUTES.players.wrapped({ nickname, year: now.getFullYear() }) : null,
    analyticsHref: session?.lestaAccountId === accountId ? ROUTES.account.analytics : null
  };
};
