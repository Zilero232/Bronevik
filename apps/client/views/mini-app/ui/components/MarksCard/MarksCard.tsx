'use client';

import { useTranslations } from 'next-intl';

import { Skeleton } from '@/ui-kit';

import type { MarksCardProps } from './MarksCard.types';

import { MINI_APP } from '../../../config';
import { closestMarks } from '../../../lib/dashboard-picks';
import { MarkRow } from './components';

import s from './MarksCard.module.scss';

const MARK_COUNTS = ['moe3', 'moe2', 'moe1'] as const;

export const MarksCard = ({ marks }: MarksCardProps) => {
  const t = useTranslations('tg.marks');

  if (!marks) {
    return <Skeleton height={180} shape='block' />;
  }

  const chases = closestMarks({ items: marks.items, limit: MINI_APP.marksLimit });

  return (
    <section className={s.root}>
      <header className={s.header}>
        <h2 className={s.title}>{t('title')}</h2>
        <dl className={s.counts}>
          {MARK_COUNTS.map((key) => (
            <div key={key} className={s.count} data-marks={key}>
              <dt>{t(`counts.${key}`)}</dt>
              <dd>{marks.summary[key]}</dd>
            </div>
          ))}
        </dl>
      </header>
      {chases.length > 0 ? (
        <ul className={s.list}>
          {chases.map((chase) => (
            <MarkRow key={chase.row.vehicle.tankId} chase={chase} />
          ))}
        </ul>
      ) : (
        <p className={s.empty}>{t('empty')}</p>
      )}
    </section>
  );
};
