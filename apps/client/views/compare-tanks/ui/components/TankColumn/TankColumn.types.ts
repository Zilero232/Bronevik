import type { VehicleSummary } from '@bronevik/schemas';

import type { BoardSection } from '../../../model/hooks';

export type TankColumnProps = {
  vehicle: VehicleSummary;
  index: number;
  sections: BoardSection[];
};
