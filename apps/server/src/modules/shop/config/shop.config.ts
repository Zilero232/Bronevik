export const SHOP_QUEUE = {
  name: 'shop',
  jobs: { offers: 'offers', bonusCodes: 'bonus-codes', bonusStatus: 'bonus-status', newsEnrich: 'news-enrich' }
} as const;

export const SHOP_SCHEDULES = [
  { id: 'shop-offers', queue: SHOP_QUEUE.name, name: SHOP_QUEUE.jobs.offers, repeat: { pattern: '15 */3 * * *' } },
  {
    id: 'shop-bonus-codes',
    queue: SHOP_QUEUE.name,
    name: SHOP_QUEUE.jobs.bonusCodes,
    repeat: { pattern: '40 */2 * * *' }
  },
  {
    id: 'shop-bonus-status',
    queue: SHOP_QUEUE.name,
    name: SHOP_QUEUE.jobs.bonusStatus,
    repeat: { every: 30 * 60_000 }
  },
  {
    id: 'shop-news-enrich',
    queue: SHOP_QUEUE.name,
    name: SHOP_QUEUE.jobs.newsEnrich,
    repeat: { every: 20 * 60_000 }
  }
] as const;

export const OFFER_SCRAPE = {
  source: 'tanki.su',
  maxDetailPages: 8,
  tankKeyword: /танк|техник/i
} as const;

export const BONUS_CODE = {
  pattern: /^(?=[A-Z0-9]*[A-Z])(?=[A-Z0-9]*\d)[A-Z0-9]{6,24}$/,
  titlePattern: /бонус-коды?\s+([A-Z0-9, ]{6,80})/giu,
  titleTokenPattern: /^(?=[A-Z0-9]*[A-Z])[A-Z0-9]{6,24}$/,
  minReports: 3,
  verdictShare: 0.6,
  reportWindowDays: 3,
  staleAfterDays: 60,
  wotexpressSource: 'wotexpress.info',
  reportThrottle: { limit: 20, ttl: 60_000 }
} as const;

export const OFFER_RETURN = {
  minOccurrences: 2,
  minAbsentDays: 14,
  archiveLimit: 100
} as const;

export const NEWS_ENRICH = {
  batch: 200,
  versionPattern: /(?:обновлени[еяю]|патч|update|версия)\s*(\d+\.\d+(?:\.\d+){0,2})/iu,
  patchKind: /обновлени|патч|update|список изменений/i,
  minTankNameLength: 3,
  defaultLimit: 30,
  maxLimit: 100
} as const;
