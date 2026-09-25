import { match } from 'ts-pattern';

import type { LeagueValueInput, RankedEntry, RankLeagueInput } from './league.types';

const valueOf = ({ stats, metric }: LeagueValueInput): number | null =>
  match(metric)
    .with('damage', () => (stats.battles > 0 ? stats.damage / stats.battles : null))
    .with('wn8', () => (stats.wn8Battles > 0 ? stats.wn8Weighted / stats.wn8Battles : null))
    .with('marks', () => stats.marks)
    .with('battles', () => stats.battles)
    .exhaustive();

export const rankLeague = ({ stats, metric, minBattles }: RankLeagueInput): RankedEntry[] => {
  const needsBattles = metric === 'damage' || metric === 'wn8';
  const rows = stats.map((row) => ({
    accountId: row.accountId,
    battles: row.battles,
    value: needsBattles && row.battles < minBattles ? null : valueOf({ stats: row, metric })
  }));

  const sorted = rows.sort((a, b) => (b.value ?? Number.NEGATIVE_INFINITY) - (a.value ?? Number.NEGATIVE_INFINITY) || b.battles - a.battles);
  let rank = 0;
  let previous: number | null | undefined;

  return sorted.map((row, index) => {
    if (row.value !== previous) {
      rank = index + 1;
      previous = row.value;
    }

    return { ...row, rank };
  });
};
