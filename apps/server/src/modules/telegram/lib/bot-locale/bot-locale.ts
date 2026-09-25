import type { BotLocale } from '../../telegram.types';

import { BOT_LOCALES, FALLBACK_BOT_LOCALE } from '../../config';

export const resolveBotLocale = (raw: string | null | undefined): BotLocale =>
  BOT_LOCALES.find((locale) => raw?.toLowerCase().startsWith(locale)) ?? FALLBACK_BOT_LOCALE;
