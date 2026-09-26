import type { PlayerSearchResult, SearchResult } from '@bronevik/schemas';

export type PickPlayerInput = {
  player: string;
  results: readonly SearchResult[];
};

export type PickedPlayer = PlayerSearchResult | null;
