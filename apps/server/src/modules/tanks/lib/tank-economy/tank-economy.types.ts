import type { VehicleSummary } from '@otmetki/schemas';

export type EconomyBattle = {
  tankId: number;
  credits: number;
  creditsGross: number | null;
  repairCost: number | null;
  ammoCost: number | null;
  consumablesCost: number | null;
  xp: number;
  isPremiumAccount: boolean | null;
};

export type AccountEconomyInput = {
  accountId: number;
  days: number;
  battles: readonly EconomyBattle[];
  vehicles: ReadonlyMap<number, VehicleSummary>;
};
