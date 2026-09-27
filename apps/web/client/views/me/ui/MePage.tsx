'use client';

import { useAuthSession } from '@/entities/auth/session';

import { MeDashboard } from './components';

export const MePage = () => {
  const { data: session } = useAuthSession();

  if (!session) {
    return null;
  }

  return <MeDashboard name={session.user.name} />;
};
