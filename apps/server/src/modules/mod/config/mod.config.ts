import { GAME_MODE_BONUS_TYPES } from '../../../common/lib';

export const BIND_CODE = {
  alphabet: 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789',
  length: 10,
  ttlMinutes: 10,
  throttle: { limit: 10, ttl: 60_000 },
  failurePrefix: 'otmetki:mod:bind-failures:',
  maxFailuresPerRequester: 10,
  failureWindowSeconds: 900
} as const;

export const MOD_DEVICE = {
  idPrefix: 'dev_',
  idBytes: 12,
  secretContext: 'otmetki-mod-device:',
  header: 'x-otmetki-device',
  signatureHeader: 'x-otmetki-signature',
  timestampHeader: 'x-otmetki-timestamp',
  nonceHeader: 'x-otmetki-nonce'
} as const;

export const MOD_REQUEST = {
  version: 'v2',
  maxSkewSeconds: 300,
  noncePattern: /^[\w-]{16,64}$/u,
  noncePrefix: 'otmetki:mod:nonce:',
  nonceTtlSeconds: 900
} as const;

export const MOD_INGEST = {
  ledgerPrefix: 'mod:event:',
  ledgerTtlSeconds: 30 * 86_400,
  randomBonusType: 1,
  throttle: { limit: 120, ttl: 60_000 }
} as const;

export const BATTLE_CORROBORATION = {
  windowHours: 72,
  collectorBattleTypes: GAME_MODE_BONUS_TYPES.random.map(String)
} as const;

export const MOD_SHOTS = {
  maxPerBattle: 200,
  maxDamage: 10_000,
  maxDistanceM: 1_500,
  shells: ['armor_piercing', 'armor_piercing_cr', 'hollow_charge', 'high_explosive', 'unknown'],
  outcomes: ['damage', 'no_damage', 'miss']
} as const;

export const MOD_ACHIEVEMENTS = {
  maxPerBattle: 64,
  maxNameLength: 64
} as const;

export const MOD_PLATOON = {
  minSize: 2,
  maxSize: 3
} as const;
