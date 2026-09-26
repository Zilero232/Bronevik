'use client';

import { useAuthSession } from '@/entities/auth/session';
import { ROUTES } from '@/shared/constants';

import { useProfileContext } from '../../context';
import { useProfileShare } from '../use-profile-share';

export const useProfileActions = () => {
  const { accountId, nickname } = useProfileContext();
  const { data: session } = useAuthSession();
  const { copied, share } = useProfileShare();

  return {
    accountId,
    copied,
    share,
    signatureHref: ROUTES.players.signature(nickname),
    analyticsHref: session?.lestaAccountId === accountId ? ROUTES.account.analytics : null
  };
};
