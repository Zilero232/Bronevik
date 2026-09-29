import type { MapSummary } from '@otmetki/schemas';

export type MapFocus = {
  x: number;
  y: number;
};

export type DailyMap = {
  map: MapSummary;
  focus: MapFocus;
};

export type PickDailyMapInput = {
  maps: readonly MapSummary[];
  day: string;
};

export type MapGameStatus = 'lost' | 'playing' | 'won';

export type MapGameStatusInput = {
  guessIds: readonly string[];
  targetId: string;
};

export type FragmentZoomInput = {
  misses: number;
  isOver: boolean;
};
