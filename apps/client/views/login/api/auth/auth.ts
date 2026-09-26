import type { TelegramWidgetConfig } from '@/shared/api/auth';

import { authClient } from '@/shared/api/auth';
import { fromAuth } from '@/shared/api/source';

import type { MagicLinkInput } from './auth.types';

export const getTelegramWidget = async (): Promise<TelegramWidgetConfig> => {
  const widget = await fromAuth(authClient.telegram.widget());

  return widget ?? { botUsername: null, enabled: false };
};

export const signInWithTelegram = async (payload: Record<string, number | string>): Promise<void> => {
  await fromAuth(authClient.telegram.callback(payload));
};

export const sendMagicLink = async ({ email, callbackURL }: MagicLinkInput): Promise<void> => {
  await fromAuth(authClient.signIn.magicLink({ email, callbackURL }));
};
