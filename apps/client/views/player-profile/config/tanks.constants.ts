import type { SortingState } from '@tanstack/react-table';

import type { PremiumFilter, TanksFilterState } from '../lib/tanks-filter';

const INITIAL_SORTING: SortingState = [{ id: 'battles', desc: true }];

const INITIAL_FILTER: TanksFilterState = { tiers: [], types: [], nation: 'all', premium: 'all', query: '' };

export const TANKS_TABLE = {
  initialSorting: INITIAL_SORTING
} as const;

export const TANKS_FILTER = {
  initial: INITIAL_FILTER,
  queryDebounceMs: 200,
  premiumOptions: ['all', 'regular', 'premium'] satisfies readonly PremiumFilter[]
} as const;
