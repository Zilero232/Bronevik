'use client';

import { useAuthSession, useLoginHref } from '@/entities/auth/session';
import { MOD_DISTRIBUTION } from '@/shared/config';
import { ROUTES } from '@/shared/constants';

export const useModPage = () => {
  const { data: session, isPending } = useAuthSession();
  const loginHref = useLoginHref();

  return {
    isSignedIn: Boolean(session),
    isSessionPending: isPending,
    bindHref: session ? ROUTES.account.overview : loginHref,
    downloadUrl: MOD_DISTRIBUTION.downloadUrl,
    fileName: MOD_DISTRIBUTION.fileName,
    mostUrl: MOD_DISTRIBUTION.mostUrl
  };
};
