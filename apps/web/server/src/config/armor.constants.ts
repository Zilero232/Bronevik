export const ARMOR_VIEWER = {
  storageDir: '.data/armor',
  cacheControl: 'private, max-age=3600',
  sourceRepo: 'unicum-gg/wot.models',
  meter: 'armor3d',
  memoryCache: { maxEntries: 32, ttlMs: 3_600_000 }
} as const;
