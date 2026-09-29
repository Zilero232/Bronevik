'use client';

import type { TankClass } from '@otmetki/icons';

import { useDebounceValue } from '@siberiacancode/reactuse';
import { useState } from 'react';
import { isDeepEqual } from 'remeda';

import type { TanksFilterState } from '../../../lib/tanks-filter';

import { TANKS_FILTER } from '../../../config';
import { matchesTankQuery, tanksRequest, tiersOf } from '../../../lib/tanks-filter';

export const useTanksFilterState = () => {
  const [filter, setFilter] = useState<TanksFilterState>(TANKS_FILTER.initial);

  const query = useDebounceValue(filter.query, TANKS_FILTER.queryDebounceMs);

  const update = (patch: Partial<TanksFilterState>) => setFilter((current) => ({ ...current, ...patch }));

  return {
    filter,
    request: tanksRequest(filter),
    matches: (name: string) => matchesTankQuery({ name, query }),
    isDirty: !isDeepEqual(filter, TANKS_FILTER.initial),
    activeCount: [filter.query !== '', filter.tiers.length > 0, filter.types.length > 0, filter.nation !== 'all', filter.premium !== 'all'].filter(
      Boolean
    ).length,
    setTiers: (values: readonly number[]) => update({ tiers: tiersOf(values.map(String)) }),
    setTypes: (types: TankClass[]) => update({ types }),
    update,
    reset: () => setFilter(TANKS_FILTER.initial)
  };
};
