import { fromUnixTime, secondsToMilliseconds } from 'date-fns';

import type { Prisma } from '../../../../../generated';
import type { BattleDataInput } from './battle-data.types';

import { BATTLE, moePercent, platoonSizeOf } from '../../lib/battle';
import { toStoredLoadout } from '../stored-loadout';
import { toStoredShot } from '../stored-shot';

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
    moePercent: percent,
    moePercentDelta: percent !== null && previousMoePercent !== null ? percent - previousMoePercent : null,
    marksOnGun: moe?.marks_on_gun ?? null,
    queueTimeMs: event.queue_time_s === null ? null : Math.round(secondsToMilliseconds(event.queue_time_s)),
    durationSec: event.duration_s,
    loadout: event.loadout ? toStoredLoadout(event.loadout) : undefined,
    achievements: event.achievements ?? [],
    startedAt: fromUnixTime(event.arena_created_at)
  };
};
