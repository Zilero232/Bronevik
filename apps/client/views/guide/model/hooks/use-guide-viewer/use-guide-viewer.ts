'use client';

import type { Guide } from '@/shared/api/guides';

import { useAuthSession } from '@/entities/auth/session';

export const useGuideViewer = (guide: Guide) => {
  const { data: session } = useAuthSession();

  return {
    isSignedIn: Boolean(session),
    isAuthor: session?.user.id === guide.author.id
  };
};
