import type { TelegramLinkCode } from '@otmetki/schemas';

export type BotLinkInput = {
  username: string | null | undefined;
  start?: string;
};

export type CodeDeepLinkInput = {
  code: TelegramLinkCode;
  botUsername: string | null;
};
