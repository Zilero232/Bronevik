export const BOT = {
  locales: ['ru', 'en'],
  fallbackLocale: 'ru',
  fallbackUsername: 'otmetki_bot'
} as const;

export const TELEGRAM_TOKENS = {
  bot: Symbol('TELEGRAM_BOT'),
  i18n: Symbol('TELEGRAM_I18N')
} as const;

export const BOT_API = {
  timeoutSeconds: 15,
  initAttempts: 4,
  initBackoffMs: 3_000,
  maxRetryAttempts: 3,
  maxDelaySeconds: 30
} as const;

export const BOT_COMMANDS = ['me', 'session', 'marks', 'clan', 'tank', 'top', 'lbz', 'next', 'settings', 'login', 'help'] as const;

export const BOT_TEXT_LIMITS = {
  topSize: 10,
  topMinBattles: 100,
  topPeriod: 'd30',
  closestMarks: 5,
  tankMatches: 1,
  inlineResults: 5,
  inlineCacheSeconds: 60,
  queryMinLength: 2
} as const;
