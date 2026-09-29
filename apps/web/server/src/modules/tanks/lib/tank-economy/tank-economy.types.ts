import type { VehicleSummary } from '@otmetki/schemas';

import type { Battle } from '../../../../../generated';

export type EconomyBattle = Pick<Battle, 'ammoCost' | 'consumablesCost' | 'creditsGross' | 'isPremiumAccount' | 'repairCost' | 'tankId' | 'xp'> & {
  credits: number;
};

export type AccountEconomyInput = {
  accountId: number;
  days: number;
  battles: readonly EconomyBattle[];
  vehicles: ReadonlyMap<number, VehicleSummary>;
};
