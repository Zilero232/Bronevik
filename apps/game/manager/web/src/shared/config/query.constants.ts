export const QUERY = {
  staleTimeMs: 30_000,
  appUpdateStaleTimeMs: 60 * 60_000,
  retries: 1,
  whatsNewStaleTimeMs: 30 * 60_000,
  gameHealthRefetchMs: 60_000
} as const;
