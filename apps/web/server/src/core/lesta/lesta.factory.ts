import type { RateLimiter } from '../../lib/lesta';
import type { BudgetInput, CreateLestaClientsInput, LestaClients } from './lesta.types';

import { LESTA } from '../../config';
import { createLestaClient, createRedisRateLimiter } from '../../lib/lesta';
import { LESTA_BUCKET } from './lesta.constants';

export const bulkRequestsPerSecond = ({ requestsPerSecond, reserve }: BudgetInput): number =>
  Math.max(1, Math.floor(requestsPerSecond * (1 - reserve)));

const chain = (limiters: readonly RateLimiter[]): RateLimiter => ({
  acquire: async () => {
    for (const limiter of limiters) {
      await limiter.acquire();
    }
  }
});

export const createLestaClients = ({ applicationId, baseUrl, redis, budget, onOutcome }: CreateLestaClientsInput): LestaClients => {
  const globalLimiter = (maxQueueSize: number) =>
    createRedisRateLimiter({ redis, key: LESTA_BUCKET.global, requestsPerSecond: budget.requestsPerSecond, maxQueueSize });

  const bulk = createRedisRateLimiter({
    redis,
    key: LESTA_BUCKET.bulk,
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
