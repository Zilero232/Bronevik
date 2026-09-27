import type { PoolConfig } from 'pg';

import type { Prisma, PrismaClient } from '../../../generated';

export type CreatePrismaClientInput = {
  url: string;
  pool?: Omit<PoolConfig, 'connectionString'>;
  log?: Prisma.LogLevel[];
};

export type CreatePgPoolInput = Pick<CreatePrismaClientInput, 'pool' | 'url'>;

export type LockedTransactionInput<T> = {
  prisma: Pick<PrismaClient, '$transaction'>;
  scope: string;
  key: string;
  run: (tx: Prisma.TransactionClient) => Promise<T>;
};

export type PrismaModuleOptions = {
  poolMax?: number;
};
