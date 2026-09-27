import type { VehicleType } from '@otmetki/schemas';

import type { Mission, MissionBranch } from '../../../../../generated';

export type MissionFilterInput = {
  mission: Pick<Mission, 'maxTier' | 'minTier' | 'vehicleClasses'>;
  branch: Pick<MissionBranch, 'key' | 'kind' | 'nations'>;
};

export type MissionVehicleFilter = {
  tiers: number[];
  types?: VehicleType[];
  nations?: string[];
};
