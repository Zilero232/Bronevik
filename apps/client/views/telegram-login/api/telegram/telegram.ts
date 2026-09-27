import type { TelegramWebLoginInput } from '@otmetki/schemas';

import { authClient } from '@/shared/api/auth';
import { telegramLinkControllerRedeem } from '@/shared/api/generated';
import { bearerToken, SESSION_REQUEST } from '@/shared/api/http';
import { fromAuth, fromSdk } from '@/shared/api/source';

export const redeemTelegramWebLogin = async (input: TelegramWebLoginInput): Promise<void> => {
  const { token } = await fromSdk(() => telegramLinkControllerRedeem({ ...SESSION_REQUEST, body: input }));

  bearerToken.clear();
  await fromAuth(authClient.signOut()).catch(() => undefined);
  bearerToken.set(token);
};
