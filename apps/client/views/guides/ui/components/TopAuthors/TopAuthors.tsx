'use client';

import { Heart } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { Avatar, Card, CardHeader, EmptyState, ErrorState } from '@/ui-kit';

import { useTopAuthors } from '../../../model/hooks';
import { SideListSkeleton } from '../SideListSkeleton';

import s from './TopAuthors.module.scss';

export const TopAuthors = () => {
  const t = useTranslations('guides.authors');
  const format = useFormatter();
  const { authors, isPending, isError, isRetrying, retry } = useTopAuthors();

  return (
    <Card aria-labelledby='guide-authors-title' padding='none'>
      <CardHeader title={<span id='guide-authors-title'>{t('title')}</span>} />
      {match({ isPending, isError, isEmpty: authors.length === 0 })
        .with({ isPending: true }, () => <SideListSkeleton />)
        .with({ isError: true }, () => <ErrorState isCompact isRetrying={isRetrying} title={t('errorTitle')} onRetry={retry} />)
        .with({ isEmpty: true }, () => <EmptyState isCompact description={t('emptyDescription')} title={t('emptyTitle')} />)
        .otherwise(() => (
          <ol className={s.list}>
            {authors.map(({ author, guides, likes }, index) => (
              <li key={author.id} className={s.row}>
                <span className={s.rank}>{index + 1}</span>
                <Avatar name={author.name} size='sm' src={author.image ?? undefined} />
                <span className={s.name}>{author.name}</span>
                <span className={s.stat} title={t('guides', { count: guides })}>
                  {t('guides', { count: guides })}
                </span>
                <span className={s.stat} title={t('likes')}>
                  <Heart aria-hidden size={12} />
                  {format.number(likes)}
                </span>
              </li>
            ))}
          </ol>
        ))}
    </Card>
  );
};
