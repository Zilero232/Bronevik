import type { SelectItem } from '@/ui-kit';

import type { ReplayFilters } from '../../../lib/replay-query';
import type { ReplayFiltersPatch } from '../use-replay-filters/use-replay-filters.types';

export type UseReplayActiveFiltersInput = {
  filters: ReplayFilters;
  playerDraft: string;
  clanDraft: string;
  update: (patch: ReplayFiltersPatch) => void;
  vehicleName: string | null;
  mapName: string | null;
  masteryItems: SelectItem[];
};
