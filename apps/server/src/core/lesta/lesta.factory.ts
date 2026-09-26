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
  const global = createRedisRateLimiter({
    redis,
    key: LESTA_BUCKET.global,
    requestsPerSecond: budget.requestsPerSecond,
    maxQueueSize: LESTA.request.maxQueueSize
  });

  const bulk = createRedisRateLimiter({ redis, key: LESTA_BUCKET.bulk, requestsPerSecond: bulkRequestsPerSecond(budget) });

  return {
    priority: createLestaClient({
      applicationId,
      baseUrl,
      fetch,
      timeoutMs: LESTA.request.timeoutMs,
      retry: LESTA.request.retry,
      rateLimiter: global
    }),
    bulk: createLestaClient({ applicationId, baseUrl, fetch, rateLimiter: chain([bulk, global]) })
  };
};
