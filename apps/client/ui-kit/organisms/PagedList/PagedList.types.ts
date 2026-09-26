import type { Key, ReactNode } from 'react';

export type PagedListLayout = 'grid' | 'rows';

export type PagedListProps<TItem> = {
  items: readonly TItem[];
  getKey: (item: TItem) => Key;
  renderItem: (item: TItem) => ReactNode;
  empty: ReactNode;
  isPending: boolean;
  isError: boolean;
  onRetry: () => void;
  onLoadMore: () => void;
  isRetrying?: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
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
