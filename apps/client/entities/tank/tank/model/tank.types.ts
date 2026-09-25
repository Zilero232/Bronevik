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

export type TankStats = TankIdentityData & {
  id: number;
  slug: string;
  winRate: number;
  avgDamage: number;
  moe3: number;
  battles: number;
  trend: number[];
};

export type TankSpecs = Readonly<Record<string, number | null>>;
