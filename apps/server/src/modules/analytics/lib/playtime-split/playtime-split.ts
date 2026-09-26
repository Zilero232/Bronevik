import { range, sumBy } from 'remeda';

import type { PlaytimeRow } from '../../../players';
import type { CellTotals, PlaytimeSplit } from './playtime-split.types';

import { percentOf } from '../../../../common/lib';

const HOURS = 24;
const WEEKDAYS = 7;

const totals = (cells: readonly PlaytimeRow[]): CellTotals => ({
  battles: sumBy(cells, (cell) => cell.battles),
  wins: sumBy(cells, (cell) => cell.wins),
  damage: sumBy(cells, (cell) => cell.damage)
});

const stat = ({ battles, wins, damage }: CellTotals) => ({
  battles: Math.round(battles),
  winRate: percentOf({ value: wins, by: battles }),
  avgDamage: battles > 0 ? damage / battles : null
});

export const splitPlaytime = (cells: readonly PlaytimeRow[]): PlaytimeSplit => ({
  hours: range(0, HOURS).map((hour) => ({ hour, ...stat(totals(cells.filter((cell) => cell.hour === hour))) })),
  weekdays: range(0, WEEKDAYS).map((weekday) => ({ weekday, ...stat(totals(cells.filter((cell) => cell.weekday === weekday))) }))
});
