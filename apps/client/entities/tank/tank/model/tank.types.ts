import type { Nation, TankClass, Tier } from '@otmetki/icons';
import type { VehicleImages } from '@otmetki/schemas';

export type TankIdentityData = {
  name: string;
  nation: Nation;
  type: TankClass;
  tier: Tier;
  isPremium?: boolean;
  images?: VehicleImages | null;
};

export type TankSpecs = Readonly<Record<string, number | null>>;
