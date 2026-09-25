import type { MapSummary } from '@bronevik/schemas';

export type MapGridProps = {
  maps: MapSummary[];
  isPending: boolean;
  isError: boolean;
  isFiltered: boolean;
  onRetry: () => void;
  onReset: () => void;
};
