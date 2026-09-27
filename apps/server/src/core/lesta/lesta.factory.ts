import type { LestaFetch, RateLimiter } from '../../lib/lesta';
import type { BudgetInput, CreateLestaClientsInput, LestaClients, MeteredFetchInput } from './lesta.types';

import { LESTA } from '../../config';
import { classifyLestaResponse, createLestaClient, createRedisRateLimiter } from '../../lib/lesta';
import { LESTA_BUCKET } from './lesta.constants';

export const bulkRequestsPerSecond = ({ requestsPerSecond, reserve }: BudgetInput): number =>
  Math.max(1, Math.floor(requestsPerSecond * (1 - reserve)));

export const meteredFetch =
  ({ fetch, record }: MeteredFetchInput): LestaFetch =>
  async (input, init) => {
    try {
      const response = await fetch(input, init);

      record(classifyLestaResponse({ status: response.status, body: await response.clone().text() }));

      return response;
    } catch (error) {
      record('degraded');

      throw error;
    }
  };

const chain = (limiters: readonly RateLimiter[]): RateLimiter => ({
  acquire: async () => {
    for (const limiter of limiters) {
      await limiter.acquire();
    }
  }
});

export const createLestaClients = ({ applicationId, baseUrl, redis, budget, fetch }: CreateLestaClientsInput): LestaClients => {
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
      fetch,
      timeoutMs: LESTA.request.timeoutMs,
      retry: LESTA.request.retry,
      rateLimiter: globalLimiter(LESTA.request.maxQueueSize)
    }),
    bulk: createLestaClient({
      applicationId,
      baseUrl,
      fetch,
      timeoutMs: LESTA.bulk.timeoutMs,
      retry: LESTA.bulk.retry,
      rateLimiter: chain([bulk, globalLimiter(LESTA.bulk.maxQueueSize)])
    })
  };
};
