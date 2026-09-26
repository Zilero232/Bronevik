import type { TelegramWebLoginInput } from '@otmetki/schemas';
import { telegramLinkControllerRedeem } from '@/shared/api/generated';
import { bearerToken, SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

export const redeemTelegramWebLogin = async (input: TelegramWebLoginInput): Promise<void> => {
  const { token } = await fromSdk(() => telegramLinkControllerRedeem({ ...SESSION_REQUEST, body: input }));

  bearerToken.set(token);
};
