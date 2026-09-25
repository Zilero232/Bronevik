export const LESTA = {
  tierAReserve: 0.2,
  request: {
    timeoutMs: 8_000,
    retry: { retries: 2, minTimeout: 300, maxTimeout: 2_000 },
    maxQueueSize: 200
  }
} as const;
