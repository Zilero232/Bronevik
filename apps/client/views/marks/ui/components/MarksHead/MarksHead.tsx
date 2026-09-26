'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { KeyFigure, KeyFigures, PageHeader } from '@/ui-kit';

import type { MarksHeadProps } from './MarksHead.types';

import { TextFigure } from './components';

import s from './MarksHead.module.scss';

export const MarksHead = ({ total, updatedAt, isLoading }: MarksHeadProps) => {
  const t = useTranslations('marks.head');
  const format = useFormatter();

  const updated = updatedAt ? format.dateTime(new Date(updatedAt), { dateStyle: 'medium' }) : t('updatedUnknown');

  return (
    <PageHeader description={t('lead', { date: updated })} title={t('title')}>
      <KeyFigures className={s.figures}>
        <KeyFigure label={t('tracked')} value={isLoading ? null : total} />
        <TextFigure isLoading={isLoading} label={t('updated')} value={updated} />
        <TextFigure label={t('window')} value={t('windowValue')} />
      </KeyFigures>
    </PageHeader>
  );
};
