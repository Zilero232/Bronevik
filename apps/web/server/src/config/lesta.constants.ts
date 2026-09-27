export const LESTA = {
  tierAReserve: 0.2,
  request: {
    timeoutMs: 8_000,
    retry: { retries: 2, minTimeout: 300, maxTimeout: 2_000 },
    maxQueueSize: 200
  },
  bulk: {
    timeoutMs: 10_000,
    retry: { retries: 1, minTimeout: 1_000, maxTimeout: 3_000 },
    maxQueueSize: 5_000
  }
} as const;
