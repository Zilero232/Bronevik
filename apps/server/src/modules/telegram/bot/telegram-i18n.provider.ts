import { I18n } from '@grammyjs/i18n';
import { fileURLToPath } from 'node:url';

import type { BotContext } from '../telegram.types';

import { BOT_LOCALE_FILES, BOT_LOCALES, FALLBACK_BOT_LOCALE } from '../config';
import { resolveBotLocale } from '../lib';
import { TELEGRAM_I18N } from './telegram-bot.constants';

export const createBotI18n = (): I18n<BotContext> => {
  const i18n = new I18n<BotContext>({
    defaultLocale: FALLBACK_BOT_LOCALE,
    fluentBundleOptions: { useIsolating: false },
    localeNegotiator: (ctx) => ctx.chat$?.locale ?? resolveBotLocale(ctx.from?.language_code)
  });

  for (const locale of BOT_LOCALES) {
    i18n.loadLocaleSync(locale, { filePath: fileURLToPath(BOT_LOCALE_FILES[locale]) });
  }

  return i18n;
};

export const telegramI18nProvider = {
  provide: TELEGRAM_I18N,
  useFactory: createBotI18n
};
