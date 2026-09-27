import type { PlaytimeCell } from '@otmetki/schemas';

import { range } from 'remeda';

import type { PlaytimeRow } from '../../players.types';
import type { CellPosition } from './playtime.types';

import { percentOf, ratio } from '../../../../common/lib';
import { PLAYTIME } from './playtime.constants';

const cellKey = ({ weekday, hour }: CellPosition): string => `${weekday}:${hour}`;

export const playtimeCells = (rows: readonly PlaytimeRow[]): PlaytimeCell[] => {
  const byCell = new Map<string, PlaytimeRow>();

  for (const row of rows) {
    const key = cellKey(row);
    const current = byCell.get(key);

    byCell.set(
      key,
      current ? { ...current, battles: current.battles + row.battles, wins: current.wins + row.wins, damage: current.damage + row.damage } : row
    );
  }

  return range(0, PLAYTIME.weekdays).flatMap((weekday) =>
    range(0, PLAYTIME.hours).map((hour) => {
      const row = byCell.get(cellKey({ weekday, hour }));
      const battles = Math.max(0, Math.round(row?.battles ?? 0));

      return {
        weekday,
        hour,
        battles,
        winRate: row ? percentOf({ value: row.wins, by: battles }) : null,
        avgDamage: row ? ratio({ value: Math.max(0, row.damage), by: battles }) : null
      };
    })
  );
};
