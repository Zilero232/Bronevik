import type { useMapStatsFilters } from '../../../model/hooks';

export type StatsFiltersProps = {
  filters: ReturnType<typeof useMapStatsFilters>;
};
