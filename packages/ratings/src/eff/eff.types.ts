import type { BattleTotals, TankTotals } from '../stats';

export type TankTiers = ReadonlyMap<number, number>;

export type AverageTierInput = {
  tanks: readonly Pick<TankTotals, 'battles' | 'tankId'>[];
  tiers: TankTiers;
};

export type EffInput = {
  totals: BattleTotals;
  averageTier: number;
};
