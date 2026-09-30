'use client';

import { COMPARE } from '@otmetki/schemas';
import { useState } from 'react';

import {
  clearCompare,
  COMPARE_KINDS,
  COMPARE_TARGET,
  compareHref,
  compareIds,
  NO_COMPARE_SELECTION,
  removeFromCompare,
  showCompareKind,
  useCompareSelection
} from '@/features/compare/compare-selection';

import { trayChips } from '../../../lib/tray-chips';

export const useCompareTray = () => {
  const selection = useCompareSelection() ?? NO_COMPARE_SELECTION;
  const [isExpanded, setIsExpanded] = useState(false);

  const kinds = COMPARE_KINDS.filter((kind) => selection[kind].length > 0);
  const kind = kinds.includes(selection.active) ? selection.active : (kinds[0] ?? selection.active);
  const ids = compareIds({ selection, kind });
  const { max } = COMPARE_TARGET[kind];

  const collapse = () => setIsExpanded(false);

  return {
    isVisible: kinds.length > 0,
    kind,
    kinds: kinds.map((value) => ({ value, count: selection[value].length })),
    chips: trayChips({ selection, kind }),
    count: ids.length,
    max,
    openCount: Math.min(ids.length, max),
    isOverflow: ids.length > max,
    canOpen: ids.length >= COMPARE.minItems,
    href: compareHref({ kind, ids }),
    isExpanded,
    collapse,
    toggleExpanded: () => setIsExpanded((current) => !current),
    onKindChange: showCompareKind,
    onRemove: (id: number) => removeFromCompare({ kind, id }),
    onClear: () => {
      clearCompare(kind);
      collapse();
    }
  };
};
