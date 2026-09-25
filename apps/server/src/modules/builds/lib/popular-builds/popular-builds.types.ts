export type LoadoutSample = {
  optionalDevices: number[];
  consumables: number[];
  directives: number[];
  weight: number;
  won: boolean | null;
  damage: number | null;
};

export type RankedLoadout = {
  optionalDevices: number[];
  consumables: number[];
  directives: number[];
  battles: number;
  share: number;
  winRate: number | null;
  avgDamage: number | null;
};

export type RankLoadoutsInput = {
  samples: readonly LoadoutSample[];
  limit: number;
};
