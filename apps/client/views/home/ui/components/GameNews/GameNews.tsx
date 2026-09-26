'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { EmptyState, ErrorState, MediaCard, SectionHeader, Skeleton } from '@/ui-kit';

import { HOME, HOME_ICON, NEWS_KIND_ICON } from '../../../config';
import { useGameNews } from '../../../model/hooks';

import s from './GameNews.module.scss';

export const GameNews = () => {
  const t = useTranslations('home.news');
  const format = useFormatter();
  const { items, isPending, isError, retry } = useGameNews();

  return (
    <section aria-labelledby='home-news' className={s.root}>
      <SectionHeader id='home-news' more={{ href: ROUTES.news, label: t('all') }} title={t('title')} variant='display' />
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
          {items.map((item) => {
            const Emblem = NEWS_KIND_ICON[item.kind];

            return (
              <li key={item.id} className={s.item}>
                <MediaCard
                  isExternal
                  media={
                    <span aria-hidden className={s.art} data-kind={item.kind}>
                      <Emblem className={s.emblem} size={HOME_ICON.emblem} strokeWidth={1} />
                      {item.gameVersion && <span className={s.version}>{item.gameVersion}</span>}
                    </span>
                  }
                  body={item.title}
                  href={item.url}
                  sub={t(`kinds.${item.kind}`)}
                  title={<time dateTime={item.publishedAt}>{format.dateTime(new Date(item.publishedAt), { day: 'numeric', month: 'long' })}</time>}
                />
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};
