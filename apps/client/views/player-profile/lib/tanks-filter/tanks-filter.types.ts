import type { Nation, TankClass, Tier } from '@bronevik/icons';

export type PremiumFilter = 'all' | 'premium' | 'regular';

export type TanksFilterState = {
  tiers: Tier[];
  types: TankClass[];
  nation: 'all' | Nation;
  premium: PremiumFilter;
  query: string;
};

export type MatchesTankQueryInput = {
  name: string;
  query: string;
};
