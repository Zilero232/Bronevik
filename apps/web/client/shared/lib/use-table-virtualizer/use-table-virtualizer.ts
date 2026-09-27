'use client';

import { useMediaQuery } from '@siberiacancode/reactuse';
import { useVirtualizer, useWindowVirtualizer } from '@tanstack/react-virtual';

import type { UseTableVirtualizerInput } from './use-table-virtualizer.types';

import { TABLE_VIRTUALIZER } from './use-table-virtualizer.constants';

export const useTableVirtualizer = ({ count, rowHeight, getScrollElement, overscan }: UseTableVirtualizerInput) => {
  'use no memo';

  const isPageScroll = useMediaQuery(TABLE_VIRTUALIZER.pageScrollQuery);
  const node = isPageScroll ? getScrollElement() : null;
  const scrollMargin = node ? node.getBoundingClientRect().top + window.scrollY : 0;

  const inner = useVirtualizer({ count, getScrollElement, estimateSize: () => rowHeight, overscan, enabled: !isPageScroll });
  const page = useWindowVirtualizer({ count, estimateSize: () => rowHeight, overscan, scrollMargin, enabled: isPageScroll });

  const virtualizer = isPageScroll ? page : inner;
  const items = virtualizer.getVirtualItems();

  return {
    items,
    paddingTop: (items[0]?.start ?? scrollMargin) - scrollMargin,
    paddingBottom: virtualizer.getTotalSize() - ((items.at(-1)?.end ?? scrollMargin) - scrollMargin)
  };
};
