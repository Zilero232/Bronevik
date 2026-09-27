import { sortBy } from 'remeda';

import type { DetectMarkGainsInput, MarkBattle, MarkPair } from './mark-gains.types';

export const markPairKey = ({ accountId, tankId }: MarkPair): string => `${accountId}:${tankId}`;

export const detectMarkGains = ({ battles, previous }: DetectMarkGainsInput): MarkBattle[] => {
  const known = new Map(previous);
  const gains: MarkBattle[] = [];

  for (const battle of sortBy(battles, (candidate) => candidate.startedAt.getTime())) {
    const key = markPairKey(battle);
    const before = known.get(key);

    if (before !== undefined && battle.marksOnGun > before) {
      gains.push(battle);
    }

    known.set(key, battle.marksOnGun);
  }

  return gains;
};
