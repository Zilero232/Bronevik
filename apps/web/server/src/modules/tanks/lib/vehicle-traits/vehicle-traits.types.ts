import type { TankStatus, TankTraits, TankTraitsFilter, VehicleSummary } from '@otmetki/schemas';

export type SpecTraits = {
  tags: string[];
  role: string | null;
  notInShop: boolean;
};

export type ClassifyVehicleInput = {
  summary: Pick<VehicleSummary, 'isCollectible' | 'isPremium' | 'tier'>;
  spec: SpecTraits;
  hasOffers: boolean;
};

export type TankSourcesInput = ClassifyVehicleInput & {
  status: TankStatus;
};

export type MatchesTraitsInput = {
  traits: TankTraits;
  filter: TankTraitsFilter;
};

export type ResearchXpInput = {
  nextTanks: unknown;
  tankId: number;
};
