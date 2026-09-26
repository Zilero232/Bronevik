'use client';

import type { TankClass } from '@bronevik/icons';

import { useDebounceValue } from '@siberiacancode/reactuse';
import { useState } from 'react';
import { isDeepEqual } from 'remeda';

import type { TanksFilterState } from '../../../lib/tanks-filter';

import { TANKS_FILTER } from '../../../config';
import { matchesTankQuery, tanksRequest, tiersOf } from '../../../lib/tanks-filter';

export const useTanksFilter = () => {
  const [filter, setFilter] = useState<TanksFilterState>(TANKS_FILTER.initial);

  const query = useDebounceValue(filter.query, TANKS_FILTER.queryDebounceMs);

  const update = (patch: Partial<TanksFilterState>) => setFilter((current) => ({ ...current, ...patch }));

  return {
    filter,
    request: tanksRequest(filter),
    matches: (name: string) => matchesTankQuery({ name, query }),
    isDirty: !isDeepEqual(filter, TANKS_FILTER.initial),
    setTiers: (values: string[]) => update({ tiers: tiersOf(values) }),
    setTypes: (types: TankClass[]) => update({ types }),
    update,
    reset: () => setFilter(TANKS_FILTER.initial)
  };
};
