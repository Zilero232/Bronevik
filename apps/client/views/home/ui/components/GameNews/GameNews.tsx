'use client';

import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { EmptyState, ErrorState, Skeleton } from '@/ui-kit';

import { HOME } from '../../../config';
import { useGameNews } from '../../../model/hooks';
import { SectionTitle } from '../SectionTitle';
import { NewsCard } from './components';

import s from './GameNews.module.scss';

export const GameNews = () => {
  const t = useTranslations('home.news');
  const { items, isPending, isError, retry } = useGameNews();

  return (
    <section aria-labelledby='home-news' className={s.root}>
      <SectionTitle id='home-news' more={{ href: ROUTES.news, label: t('all') }} title={t('title')} />
      {isPending && (
        <div className={s.grid}>
          {Array.from({ length: HOME.news.limit }, (_, index) => (
            <Skeleton key={index} className={s.skeleton} height={220} shape='block' />
          ))}
        </div>
      )}
      {isError && <ErrorState isCompact onRetry={retry} />}
      {!isPending && !isError && items.length === 0 && <EmptyState isCompact title={t('empty')} />}
      {items.length > 0 && (
        <ul className={s.grid}>
          {items.map((item) => (
            <li key={item.id} className={s.item}>
              <NewsCard item={item} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
