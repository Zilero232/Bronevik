import type { MapSummary } from '@otmetki/schemas';

import type { MapCamouflage, MapModeKind } from '@/entities/map/map';

import type { MAP_SIZES } from '../../config';

export type MapSize = (typeof MAP_SIZES)[number];

export type FilterMapsInput = {
  maps: readonly MapSummary[];
  query: string;
  modes: readonly MapModeKind[];
  camouflages: readonly MapCamouflage[];
  sizes?: readonly MapSize[];
  pinnedIds?: readonly string[] | null;
};
