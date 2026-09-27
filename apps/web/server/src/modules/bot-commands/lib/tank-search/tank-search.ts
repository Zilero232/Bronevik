import { sortBy } from 'remeda';

import type { FindTanksInput } from '../../bot-commands.types';
import type { RankInput } from './tank-search.types';

import { TANK_SEARCH } from './tank-search.constants';

export const normaliseTankName = (raw: string): string => raw.toLowerCase().replaceAll('ё', 'е').replaceAll(TANK_SEARCH.stripped, '');

const rankOf = ({ names, query }: RankInput): number | null => {
  const normalised = names.map(normaliseTankName);

  if (normalised.includes(query)) {
    return TANK_SEARCH.rank.exact;
  }

  if (normalised.some((name) => name.startsWith(query))) {
    return TANK_SEARCH.rank.prefix;
  }

  return normalised.some((name) => name.includes(query)) ? TANK_SEARCH.rank.contains : null;
};

export const findTanks = <T>({ entries, query, limit, names }: FindTanksInput<T>): T[] => {
  const needle = normaliseTankName(query);

  if (needle.length === 0) {
    return [];
  }

  const ranked = entries.flatMap((entry) => {
    const rank = rankOf({ names: names(entry), query: needle });

    return rank === null ? [] : [{ entry, rank }];
  });

  return sortBy(ranked, (item) => item.rank)
    .slice(0, limit)
    .map((item) => item.entry);
};
