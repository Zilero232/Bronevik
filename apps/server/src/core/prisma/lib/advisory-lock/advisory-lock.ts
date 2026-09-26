import type { Prisma } from '../../../../../generated';
import type { LockedTransactionInput } from '../../prisma.types';

import { PRISMA_LOCK } from '../../prisma.constants';

export const lockedTransaction = async <T>({ prisma, scope, key, run }: LockedTransactionInput<T>): Promise<T> =>
  prisma.$transaction(
    async (tx: Prisma.TransactionClient) => {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${scope}), hashtext(${key}))`;

      return run(tx);
    },
    { timeout: PRISMA_LOCK.timeoutMs, maxWait: PRISMA_LOCK.maxWaitMs }
  );
