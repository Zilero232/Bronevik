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
