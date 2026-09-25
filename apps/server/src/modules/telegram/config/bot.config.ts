export const BOT_LOCALES = ['ru', 'en'] as const;

export const FALLBACK_BOT_LOCALE = 'ru';

export const BOT_API = {
  timeoutSeconds: 15,
  initAttempts: 4,
  initBackoffMs: 3_000,
  maxRetryAttempts: 3,
  maxDelaySeconds: 30
} as const;

export const BOT_COMMANDS = ['me', 'session', 'marks', 'clan', 'tank', 'top', 'settings', 'login', 'help'] as const;

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

export const BOT_FALLBACK_USERNAME = 'bronevik_bot';
