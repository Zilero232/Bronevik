import type { Key, ReactNode } from 'react';

import type { OffsetInfiniteList } from '@/shared/lib';

export type PagedListLayout = 'grid' | 'rows';

export type PagedListProps<TItem> = {
  list: OffsetInfiniteList<TItem>;
  getKey: (item: TItem) => Key;
  renderItem: (item: TItem) => ReactNode;
  empty: ReactNode;
  errorTitle?: ReactNode;
  errorDescription?: ReactNode;
  header?: ReactNode;
  moreLabel?: ReactNode;
  layout?: PagedListLayout;
  skeletonHeight?: number;
  skeletonCount?: number;
  label?: string;
  className?: string;
};
