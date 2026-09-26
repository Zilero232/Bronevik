import type { BotLocale } from '../../telegram.types';

import { BOT } from '../../config';

export const resolveBotLocale = (raw: string | null | undefined): BotLocale =>
  BOT.locales.find((locale) => raw?.toLowerCase().startsWith(locale)) ?? BOT.fallbackLocale;
