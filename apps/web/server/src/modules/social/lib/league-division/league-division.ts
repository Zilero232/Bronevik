import type { LeagueTier, LeagueZone } from '@otmetki/schemas';

import { LEAGUE_TIERS } from '@otmetki/schemas';
import { clamp, firstBy } from 'remeda';

import type {
  DivisionStandings,
  DivisionStandingsInput,
  DivisionZones,
  DivisionZonesInput,
  NextTierInput,
  PlaceMembersInput,
  TierMoves
} from './league-division.types';

import { rankLeague } from '../league/league';

const TOP = LEAGUE_TIERS.length - 1;

const tierIndex = (tier: LeagueTier): number => LEAGUE_TIERS.indexOf(tier);

export const nextTier = ({ tier, zone }: NextTierInput): LeagueTier => {
  if (tier === null) {
    return LEAGUE_TIERS[0];
  }

  const step = zone === 'promotion' ? 1 : zone === 'relegation' ? -1 : 0;

  return LEAGUE_TIERS[clamp(tierIndex(tier) + step, { min: 0, max: TOP })] ?? LEAGUE_TIERS[0];
};

export const divisionZones = ({ tier, entries, rules }: DivisionZonesInput): DivisionZones => {
  const ranked = entries.filter((entry) => entry.value !== null);
  const slots = ranked.length < rules.minRanked ? 0 : Math.max(1, Math.floor(ranked.length * rules.zoneShare));
  const canRise = tierIndex(tier) < TOP;
  const canDrop = tierIndex(tier) > 0;
  const promotionSlots = canRise ? slots : 0;
  const relegationSlots = canDrop ? Math.min(slots, ranked.length - promotionSlots) : 0;
  const zones = new Map<bigint, LeagueZone>(entries.map((entry) => [entry.accountId, canDrop && entry.value === null ? 'relegation' : 'stay']));

  ranked.forEach((entry, index) => {
    if (index < promotionSlots) {
      zones.set(entry.accountId, 'promotion');
    } else if (index >= ranked.length - relegationSlots) {
      zones.set(entry.accountId, 'relegation');
    }
  });

  return { zones, promotionSlots, relegationSlots };
};

export const placeMembers = ({ groups, newcomers, groupSize }: PlaceMembersInput): Map<bigint, number> => {
  const counts = new Map(groups);
  const placed = new Map<bigint, number>();

  if (counts.size === 0) {
    const total = Math.max(1, Math.ceil(newcomers.length / groupSize));

    newcomers.forEach((accountId, index) => placed.set(accountId, (index % total) + 1));

    return placed;
  }

  for (const accountId of newcomers) {
    const open = firstBy(
      [...counts].filter(([, count]) => count < groupSize),
      ([, count]) => count,
      ([groupNo]) => groupNo
    );

    const groupNo = open?.[0] ?? Math.max(...counts.keys()) + 1;

    counts.set(groupNo, (counts.get(groupNo) ?? 0) + 1);
    placed.set(accountId, groupNo);
  }

  return placed;
};

export const divisionStandings = ({ tier, stats, metric, minBattles, rules }: DivisionStandingsInput): DivisionStandings => {
  const ranked = rankLeague({ stats, metric, minBattles });
  const { zones, promotionSlots, relegationSlots } = divisionZones({ tier, entries: ranked, rules });

  return { promotionSlots, relegationSlots, entries: ranked.map((entry) => ({ ...entry, zone: zones.get(entry.accountId) ?? 'stay' })) };
};

export const tierMoves = (tier: LeagueTier): TierMoves => ({
  promotesTo: tierIndex(tier) < TOP ? nextTier({ tier, zone: 'promotion' }) : null,
  relegatesTo: tierIndex(tier) > 0 ? nextTier({ tier, zone: 'relegation' }) : null
});
