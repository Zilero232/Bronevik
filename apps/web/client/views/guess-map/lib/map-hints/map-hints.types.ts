import type { MapSummary } from '@otmetki/schemas';

export type CamouflageHint = 'match' | 'miss' | 'unknown';

export type SizeHint = 'larger' | 'match' | 'smaller' | 'unknown';

export type MapHints = {
  isCorrect: boolean;
  camouflage: CamouflageHint;
  size: SizeHint;
};

export type CompareMapsInput = {
  guess: MapSummary;
  target: MapSummary;
};
