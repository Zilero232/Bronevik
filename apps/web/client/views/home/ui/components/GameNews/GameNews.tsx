'use client';

import { useFormatter, useTranslations } from 'next-intl';
import { useId } from 'react';

import { ROUTES } from '@/shared/constants';
import { EmptyState, MediaCard, QueryState, SectionHeader, Skeleton } from '@/ui-kit';

import { HOME, HOME_ICON, NEWS_KIND_ICON } from '../../../config';
import { useGameNews } from '../../../model/hooks';

import s from './GameNews.module.scss';

export const GameNews = () => {
  const t = useTranslations('home.news');
  const format = useFormatter();
  const titleId = useId();
  const query = useGameNews();

  return (
    <section aria-labelledby={titleId} className={s.root}>
      <SectionHeader id={titleId} more={{ href: ROUTES.news, label: t('all') }} title={t('title')} variant='display' />
      <QueryState
        isCompact
        skeleton={
          <div className={s.grid}>
            <Skeleton className={s.skeleton} count={HOME.news.limit} height={HOME.news.skeletonHeight} shape='block' />
          </div>
        }
        empty={<EmptyState isCompact isFramed title={t('empty')} />}
        query={query}
      >
        {(items) => (
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
      </QueryState>
    </section>
  );
};
