'use client';

import { COMPARE } from '@otmetki/schemas';
import { useQueryStates } from 'nuqs';

import { COMPARE_PARAMS } from '../../../config';
import { addCompareId, normalizeCompareIds, removeCompareId } from '../../../lib/compare-ids';

export const useCompareIds = () => {
  const [{ ids: rawIds }, setParams] = useQueryStates(COMPARE_PARAMS, { history: 'replace' });

  const ids = normalizeCompareIds(rawIds);
  const isFull = ids.length >= COMPARE.maxTanks;

  const setIds = (next: readonly number[]) => setParams({ ids: next.length > 0 ? normalizeCompareIds(next) : null });
  const add = (id: number) => setIds(addCompareId({ ids, id }));
  const remove = (id: number) => setIds(removeCompareId({ ids, id }));
  const clear = () => setIds([]);

  return { ids, isFull, setIds, add, remove, clear };
};
