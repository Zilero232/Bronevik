'use client';

import { useAuthSession } from '@/entities/auth/session';

import { useGuide } from '../../context';

export const useGuideViewer = () => {
  const guide = useGuide();
  const { data: session } = useAuthSession();

  return {
    isSignedIn: Boolean(session),
    isAuthor: session?.user.id === guide.author.id
  };
};
