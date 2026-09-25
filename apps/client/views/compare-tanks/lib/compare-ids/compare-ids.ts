import { COMPARE } from '@bronevik/schemas';
import { unique } from 'remeda';

import type { CompareIdInput, OrderByIdsInput } from './compare-ids.types';

export const normalizeCompareIds = (ids: readonly number[]): number[] =>
  unique(ids.filter((id) => Number.isInteger(id) && id > 0)).slice(0, COMPARE.maxTanks);

export const addCompareId = ({ ids, id }: CompareIdInput): number[] => normalizeCompareIds([...ids, id]);

export const removeCompareId = ({ ids, id }: CompareIdInput): number[] => ids.filter((candidate) => candidate !== id);

export const orderByIds = <T>({ items, ids, idOf }: OrderByIdsInput<T>): T[] =>
  ids.flatMap((id) => items.filter((item) => idOf(item) === id).slice(0, 1));
