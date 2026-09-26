'use client';

import { useTranslations } from 'next-intl';

import type { PagedListProps } from './PagedList.types';

import { Button, Skeleton } from '../../atoms';
import { ErrorState } from '../../molecules';
import { pagedListVariants } from './PagedList.variants';

import s from './PagedList.module.scss';

export const PagedList = <TItem,>({
  items,
  getKey,
  renderItem,
  empty,
  isPending,
  isError,
  onRetry,
  onLoadMore,
  isRetrying = false,
  hasNextPage = false,
  isFetchingNextPage = false,
  errorTitle,
  errorDescription,
  header,
  moreLabel,
  layout = 'grid',
  skeletonHeight = 148,
  skeletonCount = 2,
  label,
  className
}: PagedListProps<TItem>) => {
  const t = useTranslations('common');
  const rootClassName = pagedListVariants({ layout, className });

  if (isError && items.length === 0) {
    return (
      <section aria-label={label} className={rootClassName}>
        <ErrorState description={errorDescription} isCompact={layout === 'rows'} isRetrying={isRetrying} title={errorTitle} onRetry={onRetry} />
      </section>
    );
  }

  if (isPending) {
    return (
      <section aria-busy aria-label={label} className={rootClassName}>
        <div className={s.skeletons}>
          {Array.from({ length: skeletonCount }, (_, index) => (
            <Skeleton key={index} height={skeletonHeight} />
          ))}
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section aria-label={label} className={rootClassName}>
        {empty}
      </section>
    );
  }

  return (
    <section aria-label={label} className={rootClassName}>
      {header && <p className={s.header}>{header}</p>}
      <ul className={s.list}>
        {items.map((item) => (
          <li key={getKey(item)} className={s.item}>
            {renderItem(item)}
          </li>
        ))}
      </ul>
      {hasNextPage && (
        <div className={s.more}>
          <Button disabled={isFetchingNextPage} size='sm' variant='secondary' onClick={onLoadMore}>
            {moreLabel ?? t('showMore')}
          </Button>
        </div>
      )}
    </section>
  );
};
