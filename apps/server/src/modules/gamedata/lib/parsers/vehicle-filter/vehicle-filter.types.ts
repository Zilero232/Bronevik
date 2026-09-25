import type { VehicleFilter, VehicleFilterRule } from '@bronevik/gamedata';

type FilterableVehicle = {
  nation: string;
  tier: number;
  tags: string[];
};

export type MatchesVehicleFilterInput = {
  filter: VehicleFilter;
  vehicle: FilterableVehicle;
};

export type MatchesRuleInput = {
  rule: VehicleFilterRule;
  vehicle: FilterableVehicle;
};
