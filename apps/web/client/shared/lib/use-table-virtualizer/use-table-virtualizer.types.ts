import type { useVirtualizer } from '@tanstack/react-virtual';

type ElementOptions = Parameters<typeof useVirtualizer<HTMLDivElement, HTMLTableRowElement>>[0];

export type UseTableVirtualizerInput = Pick<ElementOptions, 'count' | 'getScrollElement' | 'overscan'> & {
  rowHeight: number;
};
