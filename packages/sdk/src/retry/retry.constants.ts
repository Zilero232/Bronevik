export const RETRY: Readonly<{
  retries: number;
  minTimeoutMs: number;
  maxTimeoutMs: number;
  maxRetryAfterMs: number;
  statuses: readonly number[];
  retryAfterHeader: string;
}> = {
  retries: 3,
  minTimeoutMs: 500,
  maxTimeoutMs: 10_000,
  maxRetryAfterMs: 60_000,
  statuses: [408, 425, 429, 500, 502, 503, 504],
  retryAfterHeader: 'retry-after'
};
