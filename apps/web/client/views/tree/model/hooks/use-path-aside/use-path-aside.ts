'use client';

import { useMediaQuery } from '@siberiacancode/reactuse';

import { TREE_VIEW } from '../../../config';
import { usePathSelection } from '../use-path-selection';

export const usePathAside = () => {
  const isCompact = useMediaQuery(TREE_VIEW.compactQuery);
  const { selected, onClear } = usePathSelection();

  const onOpenChange = (open: boolean) => {
    if (!open) {
      onClear();
    }
  };

  return { isCompact, isOpen: selected !== null, onOpenChange };
};
