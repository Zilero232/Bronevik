import type { VehicleSummary } from '@bronevik/schemas';

import type { RESEARCH } from '../../../config';
import type { ResearchCost } from '../../../lib/research-plan';

export type ResearchValues = { -readonly [K in keyof typeof RESEARCH.defaults]: number } & {
  isPremium: boolean;
};

export type ResearchResultsProps = {
  vehicle: VehicleSummary | null;
  cost: ResearchCost | null;
  values: ResearchValues;
};
