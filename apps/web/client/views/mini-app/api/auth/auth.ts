import type { MiniAppSession } from '@/shared/api/auth';

import { authClient } from '@/shared/api/auth';
import { bearerToken } from '@/shared/api/http';
import { fromAuth } from '@/shared/api/source';

const keepSession = (session: MiniAppSession | null): void => {
  if (session) {
    bearerToken.set(session.token);
  }
};

export const signInWithMiniApp = async (initData: string): Promise<void> => {
  keepSession(await fromAuth(authClient.telegram.webApp(initData)));
};

export const signInWithVkMiniApp = async (launchParams: string): Promise<void> => {
  keepSession(await fromAuth(authClient.vk.miniApp(launchParams)));
};
