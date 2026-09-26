import { authClient } from '@/shared/api/auth';
import { bearerToken } from '@/shared/api/http';
import { fromAuth } from '@/shared/api/source';

export const signInWithMiniApp = async (initData: string): Promise<void> => {
  const session = await fromAuth(authClient.telegram.webApp(initData));

  if (session) {
    bearerToken.set(session.token);
  }
};
