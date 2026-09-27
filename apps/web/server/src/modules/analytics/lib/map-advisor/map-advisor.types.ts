import type { MapStat } from '@otmetki/schemas';

export type HighlightInput = {
  maps: readonly MapStat[];
};

export type MapHighlights = {
  weakMaps: string[];
  strongMaps: string[];
};

export type WinRateDeltaInput = {
  winRate: number | null;
  average: number | null;
};
