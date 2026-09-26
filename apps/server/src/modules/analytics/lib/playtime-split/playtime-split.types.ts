import type { HourStat, WeekdayStat } from '@otmetki/schemas';

export type PlaytimeCell = {
  weekday: number;
  hour: number;
  battles: number;
  wins: number;
  damage: number;
};

export type PlaytimeSplit = {
  hours: HourStat[];
  weekdays: WeekdayStat[];
};

export type CellTotals = {
  battles: number;
  wins: number;
  damage: number;
};
