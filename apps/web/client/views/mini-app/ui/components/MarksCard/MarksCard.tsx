'use client';

import { useTranslations } from 'next-intl';

import { Card, CardBody, CardHeader, Skeleton } from '@/ui-kit';

import type { MarksCardProps } from './MarksCard.types';

import { MARK_COUNTS } from '../../../config';
import { MarkRow } from './components';

import s from './MarksCard.module.scss';

export const MarksCard = ({ marks }: MarksCardProps) => {
  const t = useTranslations('tg.marks');

  if (!marks) {
    return <Skeleton height={180} shape='block' />;
  }

  return (
    <Card>
      <CardHeader
        action={
          <dl className={s.counts}>
            {MARK_COUNTS.map((key) => (
              <div key={key} className={s.count} data-marks={key}>
                <dt>{t(`counts.${key}`)}</dt>
                <dd>{marks.summary[key]}</dd>
              </div>
            ))}
          </dl>
        }
        title={t('title')}
      />
      <CardBody>
        {marks.chases.length > 0 ? (
          <ul className={s.list}>
            {marks.chases.map((chase) => (
              <MarkRow key={chase.row.vehicle.tankId} chase={chase} />
            ))}
          </ul>
        ) : (
          <p className={s.empty}>{t('empty')}</p>
        )}
      </CardBody>
    </Card>
  );
};
