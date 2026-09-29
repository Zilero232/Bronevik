import type { VehicleSummary } from '@otmetki/schemas';

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
