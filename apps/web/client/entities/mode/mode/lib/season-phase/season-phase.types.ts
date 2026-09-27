import type { ModeSeason } from '@otmetki/schemas';

export type SeasonPhase = 'current' | 'past' | 'upcoming';

export type SeasonPhaseInput = {
  season: ModeSeason;
  now: Date;
};
