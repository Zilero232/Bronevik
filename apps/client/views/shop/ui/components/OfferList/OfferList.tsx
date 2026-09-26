'use client';

import { useTranslations } from 'next-intl';

import { Button, EmptyState, ErrorState, Skeleton } from '@/ui-kit';

import type { OfferListProps } from './OfferList.types';

import { SHOP } from '../../../config';
import { useShopOffers } from '../../../model/hooks';
import { OfferCard } from './components';

import s from './OfferList.module.scss';

export const OfferList = ({ isActiveOnly }: OfferListProps) => {
  const t = useTranslations('shop.offers');
  const list = useShopOffers({ isActiveOnly });

  if (list.isError) {
    return <ErrorState isCompact description={t('errorDescription')} isRetrying={list.isRetrying} title={t('errorTitle')} onRetry={list.retry} />;
  }

  if (list.isPending) {
    return (
      <div className={s.grid}>
        {Array.from({ length: SHOP.skeletons }, (_, index) => (
          <Skeleton key={index} height={168} shape='block' />
        ))}
      </div>
    );
  }

  if (list.offers.length === 0) {
    return <EmptyState isCompact description={t('emptyDescription')} title={isActiveOnly ? t('emptyCurrent') : t('emptyHistory')} />;
  }

  return (
    <div className={s.root}>
      <ul className={s.grid}>
        {list.offers.map((entry) => (
          <OfferCard key={entry.offer.id} entry={entry} />
        ))}
      </ul>
      {list.hasNextPage && (
        <Button className={s.more} disabled={list.isFetchingNextPage} variant='secondary' onClick={list.loadMore}>
          {t('more', { shown: list.offers.length, total: list.total })}
        </Button>
      )}
    </div>
  );
};
