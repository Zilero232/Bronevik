import { createHash } from 'node:crypto';

import type { BattleResultEvent } from '../contract';
import type { SessionIncrement, SessionUuidInput } from './battle.types';

import { BATTLE } from './battle.constants';

export const sessionUuid = ({ accountId, sessionId }: SessionUuidInput): string => {
  const hex = createHash('sha256').update(`${accountId}:${sessionId}`).digest('hex');
  const variant = ((Number.parseInt(hex.charAt(16), 16) & 0x3) | 0x8).toString(16);

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-8${hex.slice(13, 16)}-${variant}${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
};

export const platoonSizeOf = (platoon: BattleResultEvent['platoon']): number | null => {
  if (platoon === undefined) {
    return null;
  }

  return platoon?.size ?? BATTLE.soloPlatoonSize;
};

export const moePercent = (damageRating: number): number => damageRating / BATTLE.damageRatingScale;

export const sessionIncrement = (event: BattleResultEvent): SessionIncrement => {
  const { stats } = event;

  return {
    battles: 1,
    wins: event.result === 'win' ? 1 : 0,
    losses: event.result === 'loss' ? 1 : 0,
    draws: event.result === 'draw' ? 1 : 0,
    damageDealt: stats.damage_dealt,
    damageAssisted: stats.damage_assisted_radio + stats.damage_assisted_track,
    damageBlocked: stats.damage_blocked,
    frags: stats.frags,
    spotted: stats.spotted,
    xp: stats.xp,
    survived: stats.is_alive ? 1 : 0,
    credits: stats.factual_credits
  };
};

export const countsForSession = (event: BattleResultEvent): boolean => event.session_id !== null && event.bonus_type === BATTLE.randomBonusType;
