'use client';

import { useTranslations } from 'next-intl';

import { Button, EmptyState, QueryState, Skeleton } from '@/ui-kit';

import type { OfferListProps } from './OfferList.types';

import { SHOP } from '../../../config';
import { useShopOffers } from '../../../model/hooks';
import { OfferCard } from './components';

import s from './OfferList.module.scss';

export const OfferList = ({ isActiveOnly }: OfferListProps) => {
  const t = useTranslations('shop.offers');
  const list = useShopOffers({ isActiveOnly });

  return (
    <QueryState
      isCompact
      skeleton={
        <div className={s.grid}>
          <Skeleton count={SHOP.skeletons} height={168} shape='block' />
        </div>
      }
      empty={<EmptyState isCompact description={t('emptyDescription')} title={isActiveOnly ? t('emptyCurrent') : t('emptyHistory')} />}
      errorDescription={t('errorDescription')}
      errorTitle={t('errorTitle')}
      isEmpty={() => list.offers.length === 0}
      query={list.query}
    >
      <div className={s.root}>
        <ul className={s.grid}>
          {list.offers.map((entry) => (
            <OfferCard key={entry.offer.id} entry={entry} />
          ))}
        </ul>
        {list.query.hasNextPage && (
          <Button className={s.more} disabled={list.query.isFetchingNextPage} variant='secondary' onClick={list.loadMore}>
            {t('more', { shown: list.offers.length, total: list.total })}
          </Button>
        )}
      </div>
    </QueryState>
  );
};
