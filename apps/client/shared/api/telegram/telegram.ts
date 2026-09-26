import type { TelegramLinkCode, TelegramStatus, TelegramWebLoginInput } from '@otmetki/schemas';

import {
  telegramLinkControllerIssueCode,
  telegramLinkControllerRedeem,
  telegramLinkControllerStatus,
  telegramLinkControllerUnlink
} from '../generated';
import { bearerToken, SESSION_REQUEST } from '../http';
import { fromSdk } from '../source';

export const getTelegramStatus = (): Promise<TelegramStatus> => fromSdk(() => telegramLinkControllerStatus(SESSION_REQUEST));

export const issueTelegramCode = (): Promise<TelegramLinkCode> => fromSdk(() => telegramLinkControllerIssueCode(SESSION_REQUEST));

export const unlinkTelegram = async (): Promise<void> => {
  await fromSdk(() => telegramLinkControllerUnlink(SESSION_REQUEST));
};

export const redeemTelegramWebLogin = async (input: TelegramWebLoginInput): Promise<void> => {
  const { token } = await fromSdk(() => telegramLinkControllerRedeem({ ...SESSION_REQUEST, body: input }));

  bearerToken.set(token);
};
