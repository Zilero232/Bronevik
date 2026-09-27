import type { PlayerProfile, PlayerTankRow } from '@otmetki/schemas';

export type HeroArtInput = {
  clan: PlayerProfile['summary']['clan'];
  rows: readonly PlayerTankRow[];
};
