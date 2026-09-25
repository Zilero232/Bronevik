import { sortBy } from 'remeda';

import type { TankHighlights, TankHighlightsInput } from './tank-highlights.types';

export const tankHighlights = ({ rows, count, minBattles }: TankHighlightsInput): TankHighlights => {
  const ranked = sortBy(
    rows.filter((row) => row.battles >= minBattles && row.wn8.value !== null),
    [(row) => row.wn8.value ?? 0, 'desc']
  );

  const best = ranked.slice(0, count);
  const worst = ranked.slice(Math.max(best.length, ranked.length - count)).reverse();

  return { best, worst };
};
