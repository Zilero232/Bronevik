import { TELEGRAM_BOT } from '@/shared/config';

import type { BotLinkInput } from './bot-link.types';

export const botName = (username: string | null | undefined): string => username?.replace(/^@/, '') || TELEGRAM_BOT.username;

export const botLink = ({ username, start }: BotLinkInput): string => {
  const url = new URL(`https://t.me/${botName(username)}`);

  if (start) {
    url.searchParams.set('start', start);
  }

  return url.toString();
};
