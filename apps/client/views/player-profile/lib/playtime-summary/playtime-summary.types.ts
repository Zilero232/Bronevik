import type { PlaytimeCell } from '@bronevik/schemas';

export type PlaytimeSummaryInput = {
  cells: PlaytimeCell[];
  minBattles: number;
};

export type PlaytimeSlot = {
  key: number;
  battles: number;
  winRate: number;
};

export type PlaytimeSummary = {
  bestHour: PlaytimeSlot | null;
  worstHour: PlaytimeSlot | null;
  bestWeekday: PlaytimeSlot | null;
};

export type SlotsByInput = {
  cells: PlaytimeCell[];
  keyOf: (cell: PlaytimeCell) => number;
};
