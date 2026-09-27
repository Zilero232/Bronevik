export const WORKER_CONCURRENCY = {
  enrol: 2,
  poll: 3,
  sweep: 3,
  accountsPerJob: 4,
  clans: 2,
  reference: 1,
  aggregate: 4,
  news: 1,
  purge: 1,
  developerWebhooks: 4
} as const;

const { enrol, poll, sweep, accountsPerJob, ...others } = WORKER_CONCURRENCY;
const poolHeadroom = 10;

export const WORKER_DATABASE = {
  poolMax: (enrol + poll + sweep) * accountsPerJob + Object.values(others).reduce((sum, value) => sum + value, 0) + poolHeadroom
} as const;
