import type { RateLimiter } from '../../lib/lesta';
import type { BucketKeys, BudgetInput, CreateLestaClientsInput, LestaClients } from './lesta.types';

import { LESTA } from '../../config';
import { createLestaClient, createRedisRateLimiter } from '../../lib/lesta';
import { LESTA_BUCKET } from './lesta.constants';

export const bulkRequestsPerSecond = ({ requestsPerSecond, reserve }: Pick<BudgetInput, 'requestsPerSecond' | 'reserve'>): number =>
  Math.max(1, Math.floor(requestsPerSecond * (1 - reserve)));

export const bucketKeys = (egress: string | undefined): BucketKeys =>
  egress
    ? { global: `${LESTA_BUCKET.global}${LESTA_BUCKET.separator}${egress}`, bulk: `${LESTA_BUCKET.bulk}${LESTA_BUCKET.separator}${egress}` }
    : { global: LESTA_BUCKET.global, bulk: LESTA_BUCKET.bulk };

const chain = (limiters: readonly RateLimiter[]): RateLimiter => ({
  acquire: async () => {
    for (const limiter of limiters) {
      await limiter.acquire();
    }
  }
});

export const createLestaClients = ({ applicationId, baseUrl, redis, budget, onOutcome }: CreateLestaClientsInput): LestaClients => {
  const keys = bucketKeys(budget.egress);

  const globalLimiter = (maxQueueSize: number) =>
    createRedisRateLimiter({ redis, key: keys.global, requestsPerSecond: budget.requestsPerSecond, maxQueueSize });

  const bulk = createRedisRateLimiter({
    redis,
    key: keys.bulk,
    requestsPerSecond: bulkRequestsPerSecond(budget),
    maxQueueSize: LESTA.bulk.maxQueueSize
  });

  return {
    priority: createLestaClient({
      applicationId,
      baseUrl,
      onOutcome,
      timeoutMs: LESTA.request.timeoutMs,
      retry: LESTA.request.retry,
      rateLimiter: globalLimiter(LESTA.request.maxQueueSize)
    }),
    bulk: createLestaClient({
      applicationId,
      baseUrl,
      onOutcome,
      timeoutMs: LESTA.bulk.timeoutMs,
      retry: LESTA.bulk.retry,
      rateLimiter: chain([bulk, globalLimiter(LESTA.bulk.maxQueueSize)])
    })
  };
};
