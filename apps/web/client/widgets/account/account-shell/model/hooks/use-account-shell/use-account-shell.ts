'use client';

import { useAuthSession } from '@/entities/auth/session';
import { isUnauthorizedError } from '@/shared/api/source';
import { usePathname } from '@/shared/i18n/navigation';

import { activeSection } from '../../../lib/active-tab';

export const useAccountShell = () => {
  const pathname = usePathname();
  const { data: session, isPending, error, isFetching, refetch } = useAuthSession();

  return {
    state: {
      isPending,
      isFailed: !session && Boolean(error) && !isUnauthorizedError(error),
      isSignedIn: Boolean(session)
    },
    section: activeSection(pathname),
    isRetrying: isFetching,
    retry: () => void refetch()
  };
};
