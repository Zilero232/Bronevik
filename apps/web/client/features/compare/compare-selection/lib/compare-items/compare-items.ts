import { pick } from 'remeda';

import type {
  CompareEntry,
  CompareEntryInput,
  CompareHrefInput,
  CompareKindInput,
  CompareSelection,
  RemoveCompareInput
} from './compare-items.types';

import { COMPARE_SELECTION, COMPARE_TANK_KEYS, COMPARE_TARGET, NO_COMPARE_SELECTION } from '../../config';
import { compareSelectionSchema } from './compare-items.schemas';

const compareEntryId = (entry: CompareEntry): number => (entry.kind === 'tank' ? entry.item.tankId : entry.item.accountId);

export const compareIds = ({ selection, kind }: CompareKindInput): number[] =>
  kind === 'tank' ? selection.tank.map(({ tankId }) => tankId) : selection.player.map(({ accountId }) => accountId);

export const compareCount = (selection: CompareSelection): number => selection.tank.length + selection.player.length;

export const parseCompareSelection = (value: unknown): CompareSelection => {
  const parsed = compareSelectionSchema.safeParse(value);

  if (!parsed.success) {
    return NO_COMPARE_SELECTION;
  }

  return {
    tank: parsed.data.tank.slice(0, COMPARE_SELECTION.limit),
    player: parsed.data.player.slice(0, COMPARE_SELECTION.limit),
    active: parsed.data.active
  };
};

export const hasCompareEntry = ({ selection, entry }: CompareEntryInput): boolean =>
  compareIds({ selection, kind: entry.kind }).includes(compareEntryId(entry));

export const isCompareFull = ({ selection, kind }: CompareKindInput): boolean => selection[kind].length >= COMPARE_SELECTION.limit;

export const removeCompareEntry = ({ selection, kind, id }: RemoveCompareInput): CompareSelection =>
  kind === 'tank'
    ? { ...selection, tank: selection.tank.filter(({ tankId }) => tankId !== id) }
    : { ...selection, player: selection.player.filter(({ accountId }) => accountId !== id) };

export const toggleCompareEntry = ({ selection, entry }: CompareEntryInput): CompareSelection => {
  if (hasCompareEntry({ selection, entry })) {
    return removeCompareEntry({ selection, kind: entry.kind, id: compareEntryId(entry) });
  }

  if (isCompareFull({ selection, kind: entry.kind })) {
    return selection;
  }

  return entry.kind === 'tank'
    ? { ...selection, tank: [...selection.tank, pick(entry.item, COMPARE_TANK_KEYS)], active: 'tank' }
    : { ...selection, player: [...selection.player, { accountId: entry.item.accountId, nickname: entry.item.nickname }], active: 'player' };
};

export const clearCompareKind = ({ selection, kind }: CompareKindInput): CompareSelection => ({ ...selection, [kind]: [] });

export const compareHref = ({ kind, ids }: CompareHrefInput) => ({
  pathname: COMPARE_TARGET[kind].route,
  query: { ids: ids.slice(0, COMPARE_TARGET[kind].max).join(',') }
});
