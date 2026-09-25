import type { MapCamouflage, MapModeKind } from '@/entities/map/map';

export type MapFilterValues = {
  q: string;
  modes: MapModeKind[];
  camo: MapCamouflage[];
};
