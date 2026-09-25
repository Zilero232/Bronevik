import type { TopFilterState } from '../../../lib/top-filter';

export type TopFiltersProps = {
  state: TopFilterState;
  onChange: (patch: Partial<TopFilterState>) => void;
};
