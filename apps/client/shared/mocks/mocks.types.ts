import type { Nation, TankClass, Tier } from '@bronevik/icons';
import type { VehicleImages } from '@bronevik/schemas';

export type MockSeriesPoint = {
  day: number;
  value: number;
};

export type MockPlayer = {
  id: number;
  nickname: string;
  clanTag: string | null;
  battles: number;
  winRate: number;
  wn8: number;
  avgDamage: number;
  broneIndex: number;
  marks3: number;
  masters: number;
  favoriteTank: string;
  trend: number[];
};

export type MockTank = {
  id: number;
  slug: string;
  name: string;
  nation: Nation;
  type: TankClass;
  tier: Tier;
  winRate: number;
  avgDamage: number;
  moe3: number;
  battles: number;
  isPremium: boolean;
  trend: number[];
  images: VehicleImages;
};

export type MockClan = {
  id: number;
  tag: string;
  name: string;
  members: number;
  winRate: number;
  rating: number;
};

export type MockSeriesInput = {
  seed: number;
  length: number;
  base: number;
  amplitude: number;
  drift?: number;
};

export type MockTreeLine = {
  type: TankClass;
  from?: string;
  tanks: [Tier, string][];
};

export type MockTreeEdge = {
  from: number;
  to: number;
};

export type SyntheticTankInput = {
  name: string;
  nation: Nation;
  type: TankClass;
  tier: Tier;
};

export type MockHexInput = {
  random: () => number;
  length: number;
};
