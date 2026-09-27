export const ACHIEVEMENTS_RARITY_QUEUE = {
  name: 'achievements-rarity',
  jobs: { fetch: 'fetch', aggregate: 'aggregate' }
} as const;

export const ACHIEVEMENTS_RARITY_SCHEDULES = [
  {
    id: 'achievements-rarity-fetch',
    queue: ACHIEVEMENTS_RARITY_QUEUE.name,
    name: ACHIEVEMENTS_RARITY_QUEUE.jobs.fetch,
    repeat: { pattern: '*/20 * * * *' }
  },
  {
    id: 'achievements-rarity-aggregate',
    queue: ACHIEVEMENTS_RARITY_QUEUE.name,
    name: ACHIEVEMENTS_RARITY_QUEUE.jobs.aggregate,
    repeat: { pattern: '45 */6 * * *' }
  }
] as const;
