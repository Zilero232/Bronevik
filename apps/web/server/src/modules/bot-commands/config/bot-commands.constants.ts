export const BOT_LOCALE = {
  locales: ['ru', 'en'],
  fallbackLocale: 'ru'
} as const;

export const SHARED_COMMANDS = ['stats', 'session', 'marks', 'clan', 'tank', 'top'] as const;

export const BOT_REPLY_LIMITS = {
  topSize: 10,
  topMinBattles: 100,
  topPeriod: 'd30',
  closestMarks: 5,
  tankMatches: 1
} as const;
