'use client';

import { useMediaQuery } from '@siberiacancode/reactuse';

import { TREE_VIEW } from '../../../config';

export const usePathAside = (onClear: () => void) => {
  const isCompact = useMediaQuery(TREE_VIEW.compactQuery);

  const onOpenChange = (open: boolean) => {
    if (!open) {
      onClear();
    }
  };

  return { isCompact, onOpenChange };
};
