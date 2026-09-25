'use client';

import type { Nation } from '@bronevik/icons';

import { useQueryStates } from 'nuqs';

import { TREE_PARAMS } from '../../config';

export const useTreeParams = () => {
  const [{ nation, tank }, setParams] = useQueryStates(TREE_PARAMS, { history: 'replace' });

  const setNation = (next: Nation) => setParams({ nation: next, tank: null });
  const selectTank = (tankId: number | null) => setParams({ tank: tankId });

  return { nation, selectedId: tank, setNation, selectTank };
};
