import type { MapFilterValues } from '../../../model/hooks';

export type MapFiltersProps = {
  filters: MapFilterValues;
  shown: number;
  total: number;
  isFiltered: boolean;
  onChange: (patch: Partial<MapFilterValues>) => void;
  onReset: () => void;
};
