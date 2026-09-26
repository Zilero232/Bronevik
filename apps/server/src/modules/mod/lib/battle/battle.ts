import { fromUnixTime, secondsToMilliseconds } from 'date-fns';
import { createHash } from 'node:crypto';

import type { Prisma } from '../../../../../generated';
import type { BattleResultEvent } from '../contract';
import type { BattleDataInput, SessionIncrement, SessionUuidInput } from './battle.types';

import { toStoredLoadout } from '../loadout';
import { toStoredShot } from '../shots';
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

export const toBattleData = ({ event, accountId, deviceId, sessionId, previousMoePercent }: BattleDataInput): Prisma.BattleUncheckedCreateInput => {
  const { stats, moe } = event;
  const percent = moe ? moePercent(moe.damage_rating) : null;

  return {
    accountId,
    sessionId,
    deviceId,
    arenaUniqueId: BigInt(event.arena_unique_id),
    tankId: event.vehicle.tank_id,
    arenaId: event.map_name ?? String(event.arena_type_id & BATTLE.geometryMask),
    battleType: String(event.bonus_type),
    gameMode: String(event.gui_type),
    result: event.result,
    team: event.team,
    damageDealt: stats.damage_dealt,
    damageAssistedRadio: stats.damage_assisted_radio,
    damageAssistedTrack: stats.damage_assisted_track,
    damageAssistedStun: stats.damage_assisted_stun,
    damageBlocked: stats.damage_blocked,
    damageReceived: 0,
    spotted: stats.spotted,
    frags: stats.frags,
    xp: stats.xp,
    freeXp: stats.free_xp ?? null,
    credits: stats.factual_credits,
    creditsGross: stats.original_credits,
    isPremiumAccount: stats.is_premium,
    repairCost: stats.repair_cost ?? null,
    ammoCost: stats.ammo_cost ?? null,
    consumablesCost: stats.consumables_cost ?? null,
    survived: stats.is_alive,
    lifetimeSec: stats.life_time_s,
    shotsFired: stats.shots,
    shotsHit: stats.direct_enemy_hits,
    shotsPierced: stats.piercing_enemy_hits,
    shots: event.shots && event.shots.length > 0 ? event.shots.map(toStoredShot) : undefined,
    moeMovingAvg: moe?.moving_avg_damage ?? null,
    platoonSize: platoonSizeOf(event.platoon),
    platoonMates: event.platoon ? event.platoon.mates.map((mate) => BigInt(mate)) : [],
    moePercent: percent,
    moePercentDelta: percent !== null && previousMoePercent !== null ? percent - previousMoePercent : null,
    marksOnGun: moe?.marks_on_gun ?? null,
    queueTimeMs: event.queue_time_s === null ? null : Math.round(secondsToMilliseconds(event.queue_time_s)),
    durationSec: event.duration_s,
    loadout: event.loadout ? toStoredLoadout(event.loadout) : undefined,
    achievements: [],
    startedAt: fromUnixTime(event.arena_created_at)
  };
};

export const sessionIncrement = (event: BattleDataInput['event']): SessionIncrement => {
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

export const countsForSession = (event: BattleDataInput['event']): boolean =>
  event.session_id !== null && event.bonus_type === BATTLE.randomBonusType;
