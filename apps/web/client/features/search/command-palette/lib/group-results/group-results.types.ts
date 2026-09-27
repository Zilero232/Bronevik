import type { ClanSearchResult, PlayerSearchResult, TankSearchResult } from '@otmetki/schemas';

export type SearchGroups = {
  players: PlayerSearchResult[];
  tanks: TankSearchResult[];
  clans: ClanSearchResult[];
};
