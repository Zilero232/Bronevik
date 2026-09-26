import type { Nation, TankClass, Tier } from '@bronevik/icons';
import type { VehicleImages } from '@bronevik/schemas';

export type TankIdentityData = {
  name: string;
  nation: Nation;
  type: TankClass;
  tier: Tier;
  isPremium?: boolean;
  images?: VehicleImages | null;
};

export type TankSpecs = Readonly<Record<string, number | null>>;
