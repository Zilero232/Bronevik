import type { BotLocale } from '../../bot-commands.types';

import { BOT_LOCALE } from '../../config';

export const resolveBotLocale = (raw: string | null | undefined): BotLocale =>
  BOT_LOCALE.locales.find((locale) => raw?.toLowerCase().startsWith(locale)) ?? BOT_LOCALE.fallbackLocale;
