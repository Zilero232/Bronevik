import type { Key, ReactNode } from 'react';

export type PagedListLayout = 'grid' | 'rows';

export type QueryStatusProps = {
  isPending: boolean;
  isError: boolean;
  isRetrying?: boolean;
  onRetry: () => void;
};

export type PagedListProps<TItem> = QueryStatusProps & {
  items: readonly TItem[];
  getKey: (item: TItem) => Key;
  renderItem: (item: TItem) => ReactNode;
  empty: ReactNode;
  onLoadMore: () => void;
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
