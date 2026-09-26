import { env } from '@/shared/config/client-env';

import type { AuthSession, LestaStartInput, MagicLinkInput, TelegramWidgetConfig } from './auth.types';

import { bearerToken } from '../http';
import { fromAuth } from '../source';
import { authClient } from './auth-client';
import { AUTH_CLIENT } from './auth.constants';

export const getAuthSession = async (): Promise<AuthSession> => {
  const session = await fromAuth(authClient.getSession());

  return session ? { user: session.user } : null;
};

export const lestaStartUrl = ({ callbackURL }: LestaStartInput) => {
  const url = new URL(AUTH_CLIENT.lestaStartPath, env.NEXT_PUBLIC_API_URL);

  url.searchParams.set('callbackURL', callbackURL);

  return url.toString();
};

export const getTelegramWidget = async (): Promise<TelegramWidgetConfig> => {
  const widget = await fromAuth(authClient.telegram.widget());

  return widget ?? { botUsername: null, enabled: false };
};

export const signInWithTelegram = async (payload: Record<string, number | string>): Promise<void> => {
  await fromAuth(authClient.telegram.callback(payload));
};

export const signInWithMiniApp = async (initData: string): Promise<void> => {
  const session = await fromAuth(authClient.telegram.webApp(initData));

  if (session) {
    bearerToken.set(session.token);
  }
};

export const sendMagicLink = async ({ email, callbackURL }: MagicLinkInput): Promise<void> => {
  await fromAuth(authClient.signIn.magicLink({ email, callbackURL }));
};

export const signOut = async (): Promise<void> => {
  await fromAuth(authClient.signOut());
  bearerToken.clear();
};
