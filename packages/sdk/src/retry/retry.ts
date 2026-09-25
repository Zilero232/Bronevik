import pRetry from 'p-retry';

import type { RetryingFetchInput } from './retry.types';

import { RETRY } from './retry.constants';

class RetryableStatusError extends Error {
  constructor(readonly response: Response) {
    super(`HTTP ${response.status}`);
  }
}

const wait = async (ms: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, ms));
};

export const retryAfterMs = (header: string | null): number | null => {
  if (!header) {
    return null;
  }

  const seconds = Number(header);
  const ms = Number.isFinite(seconds) ? seconds * 1000 : Date.parse(header) - Date.now();

  return Number.isFinite(ms) && ms > 0 ? Math.min(ms, RETRY.maxRetryAfterMs) : null;
};

export const isRetryableStatus = (status: number): boolean => RETRY.statuses.includes(status);

export const retryingFetch =
  ({
    fetch,
    retries = RETRY.retries,
    minTimeoutMs = RETRY.minTimeoutMs,
    maxTimeoutMs = RETRY.maxTimeoutMs,
    sleep = wait
  }: RetryingFetchInput): typeof globalThis.fetch =>
  async (input: Parameters<typeof globalThis.fetch>[0], init?: RequestInit): Promise<Response> => {
    let last: Response | null = null;

    try {
      return await pRetry(
        async () => {
          const response = await fetch(input instanceof Request ? input.clone() : input, init);

          if (!isRetryableStatus(response.status)) {
            return response;
          }

          last = response;

          throw new RetryableStatusError(response);
        },
        {
          retries,
          minTimeout: minTimeoutMs,
          maxTimeout: maxTimeoutMs,
          onFailedAttempt: async ({ error, retriesLeft }) => {
            const delay = error instanceof RetryableStatusError ? retryAfterMs(error.response.headers.get(RETRY.retryAfterHeader)) : null;

            if (delay !== null && retriesLeft > 0) {
              await sleep(delay);
            }
          }
        }
      );
    } catch (error) {
      if (last) {
        return last;
      }

      throw error;
    }
  };
