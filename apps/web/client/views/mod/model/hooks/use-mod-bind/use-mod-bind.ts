'use client';

import { useAuthSession, useLoginHref } from '@/entities/auth/session';
import { ROUTES } from '@/shared/constants';

export const useModBind = () => {
  const { data: session } = useAuthSession();
  const loginHref = useLoginHref();

  return {
    isSignedIn: Boolean(session),
    bindHref: session ? ROUTES.account.overview : loginHref
  };
};
