import type { Nation, Tier } from '@otmetki/icons';
import type { VehicleSummary } from '@otmetki/schemas';

export type TankIdentityData = Pick<VehicleSummary, 'name' | 'type'> &
  Partial<Pick<VehicleSummary, 'isPremium'>> & {
    nation: Nation;
    tier: Tier;
    images?: VehicleSummary['images'] | null;
  };

export type TankSpecs = Readonly<Record<string, number | null>>;
