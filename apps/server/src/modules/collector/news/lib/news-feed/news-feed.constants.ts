export const NEWS_FEED = {
  source: 'tanki.su',
  summaryLength: 500,
  patchNotes: /обновлени|патч|update|версия \d/i,
  devBlog: /дневник разработ|разработчик|dev ?blog|общий тест|супертест/i
} as const;
