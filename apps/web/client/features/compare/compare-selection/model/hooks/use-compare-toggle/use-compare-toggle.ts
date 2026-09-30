'use client';

import { useTranslations } from 'next-intl';

import type { CompareEntry } from '../../../lib/compare-items';

import { COMPARE_SELECTION, NO_COMPARE_SELECTION } from '../../../config';
import { hasCompareEntry, isCompareFull } from '../../../lib/compare-items';
import { toggleCompare } from '../../../lib/compare-store';
import { useCompareSelection } from '../use-compare-selection';

export const useCompareToggle = (entry: CompareEntry) => {
  const t = useTranslations('compareTray.toggle');
  const selection = useCompareSelection() ?? NO_COMPARE_SELECTION;

  const name = entry.kind === 'tank' ? entry.item.name : entry.item.nickname;
  const isOn = hasCompareEntry({ selection, entry });
  const isFull = !isOn && isCompareFull({ selection, kind: entry.kind });
  const label = isOn ? t('remove', { name }) : isFull ? t(`full.${entry.kind}`, { limit: COMPARE_SELECTION.limit }) : t('add', { name });

  return { isOn, isFull, label, onToggle: () => toggleCompare(entry) };
};
