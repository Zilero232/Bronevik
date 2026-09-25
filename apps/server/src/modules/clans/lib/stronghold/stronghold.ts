import type { ClanStronghold, StrongholdBattles, StrongholdBuilding, StrongholdReserve } from '@bronevik/schemas';

import { sumBy } from 'remeda';

import type { RawBuilding, ToStrongholdInput } from './stronghold.types';

import { fromUnixSeconds, percentOf, toIso } from '../../../../common/lib';
import { STRONGHOLD } from './stronghold.constants';
import { rawBuildingSchema, rawReservesSchema, rawStrongholdSchema } from './stronghold.schemas';

const count = (value: number | null | undefined): number | null =>
  value === null || value === undefined || !Number.isFinite(value) ? null : Math.max(0, Math.round(value));

const toBuilding = (raw: RawBuilding): StrongholdBuilding => ({
  type: raw.building_type ?? raw.type ?? 'unknown',
  title: raw.building_title ?? raw.title ?? null,
  level: count(raw.level),
  position: raw.position === null || raw.position === undefined ? null : Math.round(raw.position),
  direction: raw.direction_name ?? raw.direction ?? null,
  arenaId: raw.arena_id === null || raw.arena_id === undefined ? null : String(raw.arena_id),
  reserve: raw.reserve_title ?? raw.reserve_type ?? null
});

const readBuildings = (value: unknown): RawBuilding[] => {
  if (Array.isArray(value)) {
    return value.flatMap((item) => {
      const parsed = rawBuildingSchema.safeParse(item);

      return parsed.success ? [parsed.data] : [];
    });
  }

  return value && typeof value === 'object' ? readBuildings(Object.values(value)) : [];
};

const toReserves = (value: unknown): StrongholdReserve[] =>
  rawReservesSchema.parse(value).flatMap((reserve) =>
    (reserve.in_stock ?? []).map((stock) => ({
      type: reserve.type ?? 'unknown',
      title: reserve.title ?? null,
      level: count(stock.level),
      status: stock.status ?? null,
      count: count(stock.amount),
      bonusType: reserve.bonus_type ?? null,
      activatedAt: toIso(fromUnixSeconds(stock.activated_at)),
      expiresAt: toIso(fromUnixSeconds(stock.active_till))
    }))
  );

const toSkirmishes = (statistics: Record<string, number | null | undefined> | null | undefined): StrongholdBattles[] =>
  STRONGHOLD.tiers.flatMap((tier) => {
    const battles = count(statistics?.[STRONGHOLD.totalKey(tier)]) ?? 0;
    const wins = Math.min(battles, count(statistics?.[STRONGHOLD.winKey(tier)]) ?? 0);

    return battles > 0 ? [{ tier, battles, wins, winRate: percentOf({ value: wins, by: battles }) }] : [];
  });

export const toStronghold = ({ clanId, level, stats, buildings, reserves, updatedAt, elo, provinces }: ToStrongholdInput): ClanStronghold => {
  const raw = rawStrongholdSchema.safeParse(stats);
  const info = raw.success ? raw.data : null;
  const storedBuildings = readBuildings(buildings);
  const skirmishes = toSkirmishes(info?.skirmish_statistics);
  const battles = sumBy(skirmishes, (tier) => tier.battles);
  const wins = sumBy(skirmishes, (tier) => tier.wins);

  return {
    clanId,
    level,
    commandCenterArenaId:
      info?.command_center_arena_id === null || info?.command_center_arena_id === undefined ? null : String(info.command_center_arena_id),
    totalResources: count(info?.total_resource_amount),
    buildingSlots: count(info?.building_slots),
    buildings: (storedBuildings.length > 0 ? storedBuildings : readBuildings(info?.buildings)).map(toBuilding),
    reserves: toReserves(reserves),
    skirmishes,
    battles,
    winRate: percentOf({ value: wins, by: battles }),
    globalMap: { provincesCount: provinces.length, ...elo, provinces },
    updatedAt: toIso(updatedAt)
  };
};
