import type { PostProgression } from '@otmetki/gamedata';

export type ParsePostProgressionInput = {
  treesXml: string;
  modificationsXml: string;
  pairsXml?: string;
  featuresXml?: string;
  pricesXml?: string;
};

export type ResolveVehicleProgressionInput = {
  progression: PostProgression;
  treeName: string | undefined;
  vehicleTier: number;
};
