export const PRISMA_POOL = {
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
  maxLifetimeSeconds: 300,
  keepAlive: true,
  keepAliveInitialDelayMillis: 5_000,
  allowExitOnIdle: false
} as const;

export const PRISMA_CODE = {
  uniqueViolation: 'P2002',
  notFound: 'P2025',
  transactionConflict: 'P2034'
} as const;
