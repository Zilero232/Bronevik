import type { MapSummary } from '@otmetki/schemas';

export type MapsTableProps = {
  maps: MapSummary[];
  isPending: boolean;
  isFiltered: boolean;
  onReset: () => void;
};
