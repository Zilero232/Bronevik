export const MODPACK_RELEASES_SOURCE = {
  asset: '../assets/releases.json',
  cacheTtlMs: 5 * 60_000,
  retryDelayMs: 60_000,
  fetchTimeoutMs: 5_000
} as const;
