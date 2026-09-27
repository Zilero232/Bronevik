'use client';

import { Heart } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';
import { useId } from 'react';

import { Avatar, Card, CardHeader, EmptyState, QueryState, Tooltip } from '@/ui-kit';

import { useTopAuthors } from '../../../model/hooks';
import { SideListSkeleton } from '../SideListSkeleton';

import s from './TopAuthors.module.scss';

export const TopAuthors = () => {
  const t = useTranslations('guides.authors');
  const titleId = useId();
  const format = useFormatter();
  const query = useTopAuthors();

  return (
    <Card aria-labelledby={titleId} padding='none'>
      <CardHeader title={<span id={titleId}>{t('title')}</span>} />
      <QueryState
        isCompact
        empty={<EmptyState isCompact description={t('emptyDescription')} title={t('emptyTitle')} />}
        errorTitle={t('errorTitle')}
        query={query}
        skeleton={<SideListSkeleton />}
      >
        {(authors) => (
          <ol className={s.list}>
            {authors.map(({ author, guides, likes }, index) => (
              <li key={author.id} className={s.row}>
                <span className={s.rank}>{index + 1}</span>
                <Avatar name={author.name} size='sm' src={author.image ?? undefined} />
                <span className={s.name}>{author.name}</span>
                <span className={s.stat}>{t('guides', { count: guides })}</span>
                <Tooltip content={t('likes')}>
                  <span aria-label={`${t('likes')}: ${format.number(likes)}`} className={s.stat}>
                    <Heart aria-hidden size={12} />
                    {format.number(likes)}
                  </span>
                </Tooltip>
              </li>
            ))}
          </ol>
        )}
      </QueryState>
    </Card>
  );
};
