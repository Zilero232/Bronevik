import type { MapSummary } from '@otmetki/schemas';

export type ReplayModeOptionsInput = {
  maps: readonly Pick<MapSummary, 'arenaId' | 'modes'>[];
  arenaId: string | null;
  hidden: readonly string[];
};
