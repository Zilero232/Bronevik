import { GAME_MODE_BONUS_TYPES } from '../../../common/lib';

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
