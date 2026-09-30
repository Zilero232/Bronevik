import type { BattleType, ReplayNation } from '../../model';

type FacetOption<Value> = {
  value: Value;
  label: string;
  count: number;
};

export type ReplayFacets = {
  maps: FacetOption<string>[];
  vehicles: (FacetOption<string> & { tier: number | null })[];
  tiers: FacetOption<number>[];
  types: FacetOption<BattleType>[];
  nations: FacetOption<ReplayNation>[];
};
