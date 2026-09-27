import { afterAll, describe, expect, it } from 'vitest';

import { PRISMA_POOL } from '../prisma.constants';
import { createPgPool, createPrismaClient } from '../prisma.factory';

const URL = 'postgresql://user:secret@localhost:5999/test';

describe('createPgPool', () => {
  const pools = [createPgPool({ url: URL }), createPgPool({ url: URL, pool: { max: PRISMA_POOL.max + 5, idleTimeoutMillis: 1 } })];

  afterAll(async () => {
    await Promise.all(pools.map((pool) => pool.end()));
  });

  it('applies the defaults and the connection string', () => {
    const [pool] = pools;

    expect(pool?.options).toMatchObject({ ...PRISMA_POOL, connectionString: URL });
  });

  it('lets overrides win over the defaults but never the connection string', () => {
    const [, pool] = pools;

    expect(pool?.options).toMatchObject({ max: PRISMA_POOL.max + 5, idleTimeoutMillis: 1, connectionString: URL });
    expect(pool?.options.connectionTimeoutMillis).toBe(PRISMA_POOL.connectionTimeoutMillis);
  });
});

describe('createPrismaClient', () => {
  it('builds a client without connecting', async () => {
    const client = createPrismaClient({ url: URL, log: ['warn'] });

    expect(typeof client.$connect).toBe('function');
    expect(typeof client.player.findMany).toBe('function');

    await client.$disconnect();
  });
});
