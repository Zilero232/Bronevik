export const BIND_CODE = {
  alphabet: 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789',
  length: 6,
  ttlMinutes: 10,
  throttle: { limit: 10, ttl: 60_000 }
} as const;

export const MOD_DEVICE = {
  idPrefix: 'dev_',
  idBytes: 12,
  secretContext: 'otmetki-mod-device:',
  header: 'x-otmetki-device',
  signatureHeader: 'x-otmetki-signature'
} as const;

export const MOD_INGEST = {
  ledgerPrefix: 'mod:event:',
  ledgerTtlSeconds: 30 * 86_400,
  randomBonusType: 1,
  throttle: { limit: 120, ttl: 60_000 }
} as const;
