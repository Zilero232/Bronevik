'use client';

import { useTranslations } from 'next-intl';

import { Card, CardHeader, EmptyState, ErrorState, Skeleton } from '@/ui-kit';

import { HOME, HOME_LINKS } from '../../../config';
import { useGameNews } from '../../../model/hooks';
import { NewsRow } from './components';

import s from './GameNews.module.scss';

export const GameNews = () => {
  const t = useTranslations('home.news');
  const { items, isPending, isError, retry } = useGameNews();

  return (
    <Card padding='none'>
      <CardHeader
        action={
          <a className={s.more} href={HOME_LINKS.news} rel='noreferrer' target='_blank'>
            {t('source')}
          </a>
        }
        title={t('title')}
      />
      {isPending && (
        <div className={s.list}>
          {Array.from({ length: HOME.news.limit }, (_, index) => (
            <Skeleton key={index} height={20} />
          ))}
        </div>
      )}
      {isError && <ErrorState isCompact onRetry={retry} />}
      {!isPending && !isError && items.length === 0 && <EmptyState isCompact title={t('empty')} />}
      {items.length > 0 && (
        <ul className={s.list}>
          {items.map((item) => (
            <NewsRow key={item.id} item={item} />
          ))}
        </ul>
      )}
    </Card>
  );
};
