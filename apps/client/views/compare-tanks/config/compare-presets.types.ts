import type { VehicleType } from '@bronevik/schemas';

export type ComparePreset = {
  key: 'heavyX' | 'mediumX' | 'premiumVIII' | 'tdX';
  tiers: readonly number[];
  types?: readonly VehicleType[];
  premium?: boolean;
};
