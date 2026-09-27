export const SUPERTEST_QUEUE = {
  name: 'supertest',
  jobs: { scrape: 'scrape' }
} as const;

export const SUPERTEST_SCHEDULES = [
  { id: 'supertest-scrape', queue: SUPERTEST_QUEUE.name, name: SUPERTEST_QUEUE.jobs.scrape, repeat: { pattern: '35 */2 * * *' } }
] as const;
