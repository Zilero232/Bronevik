import type { TelegramLinkCode, TelegramStatus } from '@otmetki/schemas';

import { telegramLinkControllerIssueCode, telegramLinkControllerStatus, telegramLinkControllerUnlink } from '@/shared/api/generated';
import { SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

export const getTelegramStatus = (): Promise<TelegramStatus> => fromSdk(() => telegramLinkControllerStatus(SESSION_REQUEST));

export const issueTelegramCode = (): Promise<TelegramLinkCode> => fromSdk(() => telegramLinkControllerIssueCode(SESSION_REQUEST));

export const unlinkTelegram = async (): Promise<void> => {
  await fromSdk(() => telegramLinkControllerUnlink(SESSION_REQUEST));
};
