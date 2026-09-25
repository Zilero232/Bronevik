import type { StatsBlock } from '@bronevik/schemas';

import type { BattleStatsBlock } from '../../../../lib/lesta';
import type { RatingFieldsInput, RatingStatsInput, TotalsStatsInput } from './stats-block.types';

import { clampPercent, emptyRating, percentOf, ratingValue, ratio } from '../../../../common/lib';

const nonNegative = (value: number | null | undefined): number | null =>
  value === null || value === undefined || !Number.isFinite(value) ? null : Math.max(0, value);

const tierOrNull = (value: number | null | undefined): number | null =>
  value === null || value === undefined || value < 1 || value > 11 ? null : value;

const ratingFields = ({ avgTier, wn8, eff, broneIndex }: RatingFieldsInput) => ({
  avgTier: tierOrNull(avgTier),
  wn8: ratingValue({ kind: 'wn8', value: wn8 }),
  eff: ratingValue({ kind: 'eff', value: eff }),
  broneIndex: ratingValue({ kind: 'broneIndex', value: broneIndex })
});

const emptyStatsBlock = (): StatsBlock => ({
  battles: 0,
  winRate: null,
  avgDamage: null,
  avgFrags: null,
  avgSpotted: null,
  avgXp: null,
  avgBlocked: null,
  avgAssisted: null,
  survivalRate: null,
  accuracy: null,
  avgTier: null,
  wn8: emptyRating(),
  eff: emptyRating(),
  broneIndex: emptyRating()
});

export const statsBlockFromTotals = (input: TotalsStatsInput): StatsBlock => {
  const { battles } = input;

  if (battles <= 0) {
    return emptyStatsBlock();
  }

  return {
    battles,
    winRate: percentOf({ value: input.wins, by: battles }),
    avgDamage: nonNegative(ratio({ value: input.damageDealt, by: battles })),
    avgFrags: nonNegative(ratio({ value: input.frags, by: battles })),
    avgSpotted: nonNegative(ratio({ value: input.spotted, by: battles })),
    avgXp: input.xp === undefined ? null : nonNegative(ratio({ value: input.xp, by: battles })),
    avgBlocked: nonNegative(input.avgBlocked),
    avgAssisted: nonNegative(input.avgAssisted),
    survivalRate: input.survived === undefined ? null : percentOf({ value: input.survived, by: battles }),
    accuracy: input.hits === undefined || input.shots === undefined ? null : percentOf({ value: input.hits, by: input.shots }),
    ...ratingFields(input)
  };
};

export const statsBlockFromRating = (input: RatingStatsInput): StatsBlock => {
  if (input.battles <= 0) {
    return emptyStatsBlock();
  }

  return {
    ...emptyStatsBlock(),
    battles: input.battles,
    winRate: clampPercent(input.winRate),
    avgDamage: nonNegative(input.avgDamage),
    avgFrags: nonNegative(input.avgFrags),
    avgXp: nonNegative(input.avgXp),
    ...ratingFields(input)
  };
};

export const totalsFromLestaBlock = (block: BattleStatsBlock | undefined): TotalsStatsInput => {
  if (!block) {
    return { battles: 0, wins: 0, damageDealt: 0, frags: 0, spotted: 0 };
  }

  return {
    battles: block.battles,
    wins: block.wins,
    damageDealt: block.damage_dealt,
    frags: block.frags,
    spotted: block.spotted,
    xp: block.xp,
    survived: block.survived_battles,
    hits: block.hits,
    shots: block.shots,
    avgBlocked: block.avg_damage_blocked ?? null,
    avgAssisted: block.avg_damage_assisted ?? null
  };
};
