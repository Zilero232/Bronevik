export type RetryOptions = {
  retries?: number;
  minTimeoutMs?: number;
  maxTimeoutMs?: number;
  sleep?: (ms: number) => Promise<void>;
};

export type RetryingFetchInput = RetryOptions & {
  fetch: typeof globalThis.fetch;
};
