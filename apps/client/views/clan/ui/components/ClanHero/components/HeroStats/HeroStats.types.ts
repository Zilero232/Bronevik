import type { ClanPage } from '@bronevik/schemas';
import type { ReactNode } from 'react';

export type HeroStatsProps = {
  stats: ClanPage['stats'];
};

export type HeroStat = {
  key: string;
  label: string;
  icon: ReactNode;
  value: ReactNode;
};
