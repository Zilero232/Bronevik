'use client';

import { ArrowRight } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';
import Image from 'next/image';
import { useId } from 'react';

import { Button, EmptyState, QueryState, SectionHeader, Skeleton } from '@/ui-kit';

import { OVERVIEW } from '../../../../../config';
import { useAchievementShelf } from '../../../../../model/hooks';

import s from './AchievementShelf.module.scss';

export const AchievementShelf = () => {
  const t = useTranslations('profile.overview.shelf');
  const format = useFormatter();
  const titleId = useId();
  const { query, items, total, openAll } = useAchievementShelf();

  return (
    <section aria-labelledby={titleId} className={s.root}>
      <SectionHeader
        action={
          total > 0 && (
            <Button size='sm' variant='ghost' onClick={openAll}>
              {t('all', { total })}
              <ArrowRight aria-hidden size={14} />
            </Button>
          )
        }
        id={titleId}
        title={t('title')}
      />
      <QueryState
        isCompact
        empty={<EmptyState isCompact title={t('empty')} />}
        isEmpty={() => items.length === 0}
        query={query}
        skeleton={<Skeleton height={OVERVIEW.medalSize * 2} shape='block' />}
      >
        <ul className={s.shelf}>
          {items.map(({ name, title, image, count }) => (
            <li key={name} className={s.medal} title={title}>
              <span className={s.frame}>
                {image ? (
                  <Image unoptimized alt={title} className={s.image} height={OVERVIEW.medalSize} src={image} width={OVERVIEW.medalSize} />
                ) : (
                  <span aria-hidden className={s.placeholder} />
                )}
                {count > 1 && <span className={s.count}>×{format.number(count)}</span>}
              </span>
              <span className={s.title}>{title}</span>
            </li>
          ))}
        </ul>
      </QueryState>
    </section>
  );
};
