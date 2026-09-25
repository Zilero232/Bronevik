'use client';

import { LoaderCircle, RotateCcw, Trophy } from 'lucide-react';
import { LayoutGroup, motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { STAGGER } from '@/shared/lib';
import { Button, EmptyState, SectionHeader, Select, Skeleton } from '@/ui-kit';

import type { ClanSort } from './ClanRating.types';

import { CLAN_RATING, CLAN_SORTS } from '../../../config';
import { useClanRating } from '../../../model/hooks';
import { ClanRatingRow } from '../ClanRatingRow';

import s from './ClanRating.module.scss';

export const ClanRating = () => {
  const t = useTranslations('clans.rating');
  const { sort, setSort, items, total, isPending, isError, hasNextPage, isFetchingNextPage, loadMore, retry } = useClanRating();

  return (
    <section aria-labelledby='clan-rating-title'>
      <SectionHeader
        action={
          <Select<ClanSort>
            className={s.sort}
            items={CLAN_SORTS.map((value) => ({ value, label: t(`sorts.${value}`) }))}
            label={t('sortLabel')}
            value={sort}
            onValueChange={(next) => setSort(next)}
          />
        }
        description={t('description')}
        eyebrow={t('eyebrow')}
        index='// 01'
        title={<span id='clan-rating-title'>{t('title')}</span>}
      />
      {match({ isPending, isError, count: items.length })
        .with({ isPending: true }, () => (
          <div aria-busy aria-label={t('loading')} className={s.list} role='status'>
            {Array.from({ length: CLAN_RATING.skeletonRows }, (_, index) => (
              <Skeleton key={index} height={76} shape='block' />
            ))}
          </div>
        ))
        .with({ isError: true, count: 0 }, () => (
          <EmptyState
            action={
              <Button variant='secondary' onClick={retry}>
                <RotateCcw size={16} />
                {t('retry')}
              </Button>
            }
            code='ERR'
            description={t('errorDescription')}
            title={t('errorTitle')}
          />
        ))
        .with({ count: 0 }, () => <EmptyState description={t('emptyDescription')} icon={<Trophy size={28} />} title={t('emptyTitle')} />)
        .otherwise(() => (
          <LayoutGroup>
            <motion.ol key={sort} animate='visible' className={s.list} initial='hidden' variants={STAGGER}>
              {items.map((item, index) => (
                <ClanRatingRow key={item.clan.clanId} item={item} rank={index + 1} />
              ))}
            </motion.ol>
            <div className={s.footer}>
              <span className={s.progress}>{t('shown', { shown: items.length, total })}</span>
              {hasNextPage && (
                <Button disabled={isFetchingNextPage} size='sm' variant='secondary' onClick={loadMore}>
                  {isFetchingNextPage && <LoaderCircle className={s.spinner} size={14} />}
                  {t('more')}
                </Button>
              )}
            </div>
          </LayoutGroup>
        ))}
    </section>
  );
};
