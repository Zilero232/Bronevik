import type { MapSummary } from '@bronevik/schemas';

export type MapsTableProps = {
  maps: MapSummary[];
  isPending: boolean;
  isFiltered: boolean;
  onReset: () => void;
};
