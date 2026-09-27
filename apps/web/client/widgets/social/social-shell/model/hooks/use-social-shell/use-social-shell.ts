'use client';

import { useAuthSession, useLoginHref } from '@/entities/auth/session';
import { isUnauthorizedError } from '@/shared/api/source';

import type { SocialSection } from '../../social-shell.types';

import { SOCIAL_SECTIONS } from '../../../config';

export const useSocialShell = (section: SocialSection) => {
  const loginHref = useLoginHref();
  const { data: session, isPending, error, isFetching, refetch } = useAuthSession();

  return {
    state: {
      isPending,
      isFailed: !session && Boolean(error) && !isUnauthorizedError(error),
      isSignedIn: Boolean(session)
    },
    loginHref,
    current: SOCIAL_SECTIONS.find(({ key }) => key === section) ?? SOCIAL_SECTIONS[0],
    isRetrying: isFetching,
    retry: () => void refetch()
  };
};
