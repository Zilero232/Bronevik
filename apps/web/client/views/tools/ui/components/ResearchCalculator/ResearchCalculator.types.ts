import type { VehicleSummary } from '@otmetki/schemas';

import type { ResearchCost } from '../../../lib/research-plan';
import type { ResearchValues } from '../../../model/hooks';

export type ResearchResultsProps = {
  vehicle: VehicleSummary | null;
  cost: ResearchCost | null;
  values: ResearchValues;
};
