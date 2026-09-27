import type { PlayerSearchResult, SearchResult } from '@otmetki/schemas';

export type PickPlayerInput = {
  player: string;
  results: readonly SearchResult[];
};

export type PickedPlayer = PlayerSearchResult | null;
