import type { AuthSession } from './auth.types';

import { authClient } from '@/shared/api/auth';
import { bearerToken } from '@/shared/api/http';
import { fromAuth } from '@/shared/api/source';

export const getAuthSession = async (): Promise<AuthSession> => {
  const session = await fromAuth(authClient.getSession());

  return session ? { user: session.user } : null;
};

export const signOut = async (): Promise<void> => {
  await fromAuth(authClient.signOut());
  bearerToken.clear();
};
