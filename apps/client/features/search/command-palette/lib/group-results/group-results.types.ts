import type { ClanSearchResult, PlayerSearchResult, TankSearchResult } from '@bronevik/schemas';

export type SearchGroups = {
  players: PlayerSearchResult[];
  tanks: TankSearchResult[];
  clans: ClanSearchResult[];
};
