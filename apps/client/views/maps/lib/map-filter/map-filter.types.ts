import type { MapSummary } from '@bronevik/schemas';

import type { MapCamouflage, MapModeKind } from '@/entities/map/map';

export type FilterMapsInput = {
  maps: readonly MapSummary[];
  query: string;
  modes: readonly MapModeKind[];
  camouflages: readonly MapCamouflage[];
};
