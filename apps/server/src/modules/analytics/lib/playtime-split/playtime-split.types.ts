import type { HourStat, WeekdayStat } from '@otmetki/schemas';

export type PlaytimeSplit = {
  hours: HourStat[];
  weekdays: WeekdayStat[];
};

export type CellTotals = {
  battles: number;
  wins: number;
  damage: number;
};
