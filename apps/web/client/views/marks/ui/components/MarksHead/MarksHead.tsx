'use client';

import { MarkOfExcellenceIcon } from '@otmetki/icons';
import { useFormatter, useTranslations } from 'next-intl';

import { RatingsMethodLink } from '@/entities/player/stats';
import { ROUTES } from '@/shared/constants';
import { KeyFigure, PageHero, Skeleton } from '@/ui-kit';

import type { MarksHeadProps } from './MarksHead.types';

import s from './MarksHead.module.scss';

export const MarksHead = ({ total, updatedAt, isLoading, isEmpty }: MarksHeadProps) => {
  const t = useTranslations('marks.head');
  const format = useFormatter();

  const updated = updatedAt ? format.dateTime(new Date(updatedAt), { dateStyle: 'medium' }) : t('updatedUnknown');

  return (
    <PageHero
      figures={
        !isEmpty && (
          <>
            <KeyFigure className={s.figure} label={t('tracked')} size='xl' value={isLoading ? null : total} />
            <KeyFigure className={s.figure} label={t('updated')} value={isLoading ? <Skeleton height={24} width={96} /> : updated} />
            <KeyFigure className={s.figure} label={t('window')} value={t('windowValue')} />
          </>
        )
      }
      actions={<RatingsMethodLink section='marks' />}
      art={{ kind: 'emblem', glyph: <MarkOfExcellenceIcon marks={3} size={480} /> }}
      breadcrumbs={[{ label: t('home'), href: ROUTES.home }, { label: t('title') }]}
      lead={updatedAt ? t('lead', { date: updated }) : t('leadPlain')}
      title={t('title')}
    />
  );
};
