import type { PlaytimeCell } from '@bronevik/schemas';

export type PlaytimeGridProps = {
  cells: PlaytimeCell[];
  weekdayLabel: (index: number) => string;
};
