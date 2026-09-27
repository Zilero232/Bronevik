import { sortBy, sumBy, unique } from 'remeda';

import type { LoadoutSample, RankedLoadout, RankLoadoutsInput } from './popular-builds.types';

import { percentOf, ratio } from '../../../../common/lib';

const normalize = (ids: readonly number[]): number[] => sortBy(unique(ids), (id) => id);

export const hasItems = (sample: LoadoutSample): boolean =>
  sample.optionalDevices.length > 0 || sample.consumables.length > 0 || sample.directives.length > 0;

const keyOf = (sample: LoadoutSample): string =>
  [normalize(sample.optionalDevices), normalize(sample.consumables), normalize(sample.directives)].map((ids) => ids.join(',')).join('|');

export const rankLoadouts = ({ samples, limit }: RankLoadoutsInput): RankedLoadout[] => {
  const groups = new Map<string, LoadoutSample[]>();

  for (const sample of samples) {
    if (!hasItems(sample)) {
      continue;
    }

    const key = keyOf(sample);

    groups.set(key, [...(groups.get(key) ?? []), sample]);
  }

  const total = sumBy([...groups.values()].flat(), (sample) => sample.weight);

  const ranked = [...groups.values()].map((group): RankedLoadout => {
    const [first] = group;
    const weight = sumBy(group, (sample) => sample.weight);
    const decided = group.filter((sample) => sample.won !== null);
    const damaged = group.flatMap((sample) => (sample.damage === null ? [] : [sample.damage]));

    return {
      optionalDevices: normalize(first?.optionalDevices ?? []),
      consumables: normalize(first?.consumables ?? []),
      directives: normalize(first?.directives ?? []),
      battles: weight,
      share: total > 0 ? weight / total : 0,
      winRate: decided.length > 0 ? percentOf({ value: decided.filter((sample) => sample.won).length, by: decided.length }) : null,
      avgDamage: ratio({ value: sumBy(damaged, (damage) => damage), by: damaged.length })
    };
  });

  return sortBy(ranked, [(loadout) => loadout.battles, 'desc']).slice(0, limit);
};
