import { HONEST_RNG } from '@otmetki/schemas';
import { sumBy } from 'remeda';

import type { RngSummary } from '../../honest-rng.types';
import type { FoldBattleInput, MergeTallyInput, RollTally } from './roll-tally.types';

import { percentOf } from '../../../../common/lib';
import { shotRolls, summarizeRolls } from '../../../analytics';

export const emptyTally = (): RollTally => ({
  battles: 0,
  players: new Set(),
  shots: 0,
  damage: 0,
  nominal: 0,
  within: 0,
  bucketShots: Array.from<number>({ length: HONEST_RNG.buckets }).fill(0),
  fired: 0,
  hit: 0,
  pierced: 0
});

export const foldBattle = ({ tally, accountId, shots, accuracy }: FoldBattleInput): RollTally => {
  const rolls = shotRolls(shots);
  const { buckets } = summarizeRolls(shots);

  tally.battles += 1;
  tally.players.add(accountId);
  tally.shots += rolls.length;
  tally.damage += sumBy(rolls, (roll) => roll.damage);
  tally.nominal += sumBy(rolls, (roll) => roll.nominal);
  tally.within += rolls.filter((roll) => Math.abs(roll.ratio - 1) <= HONEST_RNG.spread + Number.EPSILON).length;
  tally.bucketShots = tally.bucketShots.map((count, index) => count + (buckets[index]?.shots ?? 0));

  if (accuracy) {
    tally.fired += accuracy.fired;
    tally.hit += accuracy.hit;
    tally.pierced += accuracy.pierced;
  }

  return tally;
};

export const tallySummary = (tally: RollTally): RngSummary => ({
  battles: tally.battles,
  players: tally.players.size,
  shots: tally.shots,
  meanRoll: tally.nominal > 0 ? tally.damage / tally.nominal - 1 : null,
  withinSpread: percentOf({ value: tally.within, by: tally.shots }),
  buckets: summarizeRolls([]).buckets.map((bucket, index) => {
    const shots = tally.bucketShots[index] ?? 0;

    return { ...bucket, shots, share: percentOf({ value: shots, by: tally.shots }) };
  }),
  hitRate: percentOf({ value: tally.hit, by: tally.fired }),
  penRate: percentOf({ value: tally.pierced, by: tally.hit })
});

export const mergeTally = ({ into, from }: MergeTallyInput): RollTally => {
  into.battles += from.battles;
  into.shots += from.shots;
  into.damage += from.damage;
  into.nominal += from.nominal;
  into.within += from.within;
  into.bucketShots = into.bucketShots.map((count, index) => count + (from.bucketShots[index] ?? 0));
  into.fired += from.fired;
  into.hit += from.hit;
  into.pierced += from.pierced;

  for (const player of from.players) {
    into.players.add(player);
  }

  return into;
};
