import type { useTanksFilter } from '../../../../../model/hooks';

export type TanksFiltersProps = {
  filters: ReturnType<typeof useTanksFilter>;
  total: number;
};
