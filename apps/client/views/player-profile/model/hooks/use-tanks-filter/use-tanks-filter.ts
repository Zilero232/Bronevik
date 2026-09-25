'use client';

import { useDebounceValue } from '@siberiacancode/reactuse';
import { useState } from 'react';

import type { PlayerTanksFilter } from '@/shared/api/players';

import type { TanksFilterState } from './use-tanks-filter.types';

import { matchesTankQuery, toggleValue } from './use-tanks-filter.helpers';

const INITIAL: TanksFilterState = { tiers: [], types: [], nation: 'all', premium: 'all', query: '' };

const QUERY_DEBOUNCE_MS = 200;

export const useTanksFilter = () => {
  const [filter, setFilter] = useState<TanksFilterState>(INITIAL);

  const query = useDebounceValue(filter.query, QUERY_DEBOUNCE_MS);

  const { tiers, types, nation, premium } = filter;
  const request: PlayerTanksFilter = {
    tiers,
    types,
    nations: nation === 'all' ? [] : [nation],
    premium: premium === 'all' ? undefined : premium === 'premium'
  };

  const update = (patch: Partial<TanksFilterState>) => setFilter((current) => ({ ...current, ...patch }));

  return {
    filter,
    request,
    matches: (name: string) => matchesTankQuery({ name, query }),
    isDirty: JSON.stringify(filter) !== JSON.stringify(INITIAL),
    toggleTier: (tier: TanksFilterState['tiers'][number]) => update({ tiers: toggleValue({ values: tiers, value: tier }) }),
    toggleType: (type: TanksFilterState['types'][number]) => update({ types: toggleValue({ values: types, value: type }) }),
    update,
    reset: () => setFilter(INITIAL)
  };
};
