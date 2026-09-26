import type { Nation, TankClass } from '@bronevik/icons';

import type { PREMIUM_FILTERS } from '../../../config';

export type PremiumFilter = (typeof PREMIUM_FILTERS)[number];

export type VehicleFilterValues = {
  tiers: number[];
  types: TankClass[];
  nations: Nation[];
  premium: PremiumFilter;
};
