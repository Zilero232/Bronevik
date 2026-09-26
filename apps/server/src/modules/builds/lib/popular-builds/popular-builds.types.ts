import type { PopularBuild } from '@otmetki/schemas';

export type LoadoutSample = {
  optionalDevices: number[];
  consumables: number[];
  directives: number[];
  weight: number;
  won: boolean | null;
  damage: number | null;
};

export type RankedLoadout = Omit<PopularBuild, 'consumables' | 'directives' | 'optionalDevices'> &
  Pick<LoadoutSample, 'consumables' | 'directives' | 'optionalDevices'>;

export type RankLoadoutsInput = {
  samples: readonly LoadoutSample[];
  limit: number;
};
