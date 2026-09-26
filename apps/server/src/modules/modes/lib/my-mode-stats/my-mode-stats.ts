import type { MyModeLine } from '@otmetki/schemas';

import { PLAY_MODES } from '@otmetki/schemas';
import { firstBy, sortBy, sumBy } from 'remeda';

import type { FoldModeStatsInput } from './my-mode-stats.types';

import { percentOf, ratio } from '../../../../common/lib';

export const foldModeStats = ({ rows, vehicles, tanksLimit }: FoldModeStatsInput): MyModeLine[] =>
  PLAY_MODES.flatMap((mode): MyModeLine[] => {
    const lines = rows.filter((row) => row.mode === mode);
    const battles = sumBy(lines, (row) => row.battles);

    if (battles === 0) {
      return [];
    }

    const survivalKnown = sumBy(lines, (row) => row.survivalKnown);
    const tanks = sortBy(
      lines.flatMap((row) => {
        const vehicle = vehicles.get(row.tankId);

        return vehicle
          ? [{ vehicle, battles: row.battles, winRate: percentOf({ value: row.wins, by: row.decided }), avgDamage: row.damage / row.battles }]
          : [];
      }),
      [(tank) => tank.battles, 'desc']
    ).slice(0, tanksLimit);

    return [
      {
        mode,
        battles,
        wins: sumBy(lines, (row) => row.wins),
        winRate: percentOf({ value: sumBy(lines, (row) => row.wins), by: sumBy(lines, (row) => row.decided) }),
        avgDamage: ratio({ value: sumBy(lines, (row) => row.damage), by: battles }),
        avgXp: ratio({ value: sumBy(lines, (row) => row.xp), by: battles }),
        avgFrags: ratio({ value: sumBy(lines, (row) => row.frags), by: battles }),
        survivalRate: percentOf({ value: sumBy(lines, (row) => row.survived), by: survivalKnown }),
        lastBattleAt: firstBy(lines, [(row) => row.lastBattleAt.getTime(), 'desc'])?.lastBattleAt.toISOString() ?? null,
        tanks
      }
    ];
  });
