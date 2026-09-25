import type { PoolConfig } from 'pg';

import type { Prisma } from '../../../generated';

export type CreatePrismaClientInput = {
  url: string;
  pool?: Omit<PoolConfig, 'connectionString'>;
  log?: Prisma.LogLevel[];
};

export type CreatePgPoolInput = Pick<CreatePrismaClientInput, 'pool' | 'url'>;
