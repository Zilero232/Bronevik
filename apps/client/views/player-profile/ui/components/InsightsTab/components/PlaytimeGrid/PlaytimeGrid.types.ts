import type { PlaytimeCell } from '@otmetki/schemas';

export type PlaytimeGridProps = {
  cells: PlaytimeCell[];
  weekdayLabel: (index: number) => string;
};
