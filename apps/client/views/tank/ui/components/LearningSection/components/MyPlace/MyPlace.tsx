'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { EmptyState, KeyFigure, KeyFigures, Skeleton } from '@/ui-kit';

import { TANK_PAGE } from '../../../../../config';
import { useMyLearning } from '../../../../../model/hooks';

import s from './MyPlace.module.scss';

export const MyPlace = () => {
  const t = useTranslations('tank.learning.mine');
  const format = useFormatter();
  const { data, isPending, isError, bucketLabel } = useMyLearning();

  if (isPending) {
    return <Skeleton height={TANK_PAGE.chartHeight / 2} shape='block' />;
  }

  if (isError || !data) {
    return <EmptyState isCompact description={t('emptyDescription')} title={t('emptyTitle')} />;
  }

  return (
    <section aria-label={t('title')} className={s.root}>
      <h3 className={s.title}>{t('title')}</h3>
      <KeyFigures isFramed={false}>
        <KeyFigure label={t('battles')} value={data.battles} />
        <KeyFigure format={{ maximumFractionDigits: 2 }} label={t('winRate')} suffix='%' value={data.winRate} />
        <KeyFigure
          format={{ maximumFractionDigits: 2 }}
          label={t('bucketWinRate', { bucket: bucketLabel ?? '' })}
          suffix='%'
          value={data.bucketWinRate}
        />
      </KeyFigures>
      {data.delta !== null && (
        <p className={s.verdict} data-tone={data.delta >= 0 ? 'good' : 'bad'}>
          {t(data.delta >= 0 ? 'ahead' : 'behind', { delta: format.number(Math.abs(data.delta), { maximumFractionDigits: 1 }) })}
        </p>
      )}
    </section>
  );
};
