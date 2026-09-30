export const MOD_SYNC_API = {
  throttle: { limit: 60, ttl: 60_000 },
  lockScope: 'mod-sync'
} as const;
