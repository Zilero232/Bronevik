import { createStoredStore } from '@/shared/lib';

import type { CompareEntry, CompareKind, CompareSelection } from '../compare-items';
import type { RemoveFromCompareInput } from './compare-store.types';

import { COMPARE_SELECTION } from '../../config';
import { clearCompareKind, compareCount, parseCompareSelection, removeCompareEntry, toggleCompareEntry } from '../compare-items';

export const compareStore = createStoredStore({ key: COMPARE_SELECTION.storageKey, parse: parseCompareSelection });

const commit = (next: (selection: CompareSelection) => CompareSelection) => {
  const selection = next(compareStore.read());

  compareStore.write(compareCount(selection) === 0 ? null : selection);
};

export const toggleCompare = (entry: CompareEntry) => commit((selection) => toggleCompareEntry({ selection, entry }));

export const removeFromCompare = ({ kind, id }: RemoveFromCompareInput) => commit((selection) => removeCompareEntry({ selection, kind, id }));

export const clearCompare = (kind: CompareKind) => commit((selection) => clearCompareKind({ selection, kind }));

export const showCompareKind = (kind: CompareKind) => commit((selection) => ({ ...selection, active: kind }));
