import type { TankStatus, TankTraits, TankTraitsFilter } from '@otmetki/schemas';

import type { SpecTraits } from '../../../reference';

export type TankSourcesInput = {
  status: TankStatus;
  spec: SpecTraits;
  hasOffers: boolean;
};

export type MatchesTraitsInput = {
  traits: TankTraits;
  filter: TankTraitsFilter;
};

export type ResearchXpInput = {
  nextTanks: unknown;
  tankId: number;
};
