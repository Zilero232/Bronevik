'use client';

import { MarkOfExcellenceIcon } from '@otmetki/icons';
import { useFormatter, useTranslations } from 'next-intl';

import { TankCell } from '@/entities/tank/tank';
import { Band, EmptyState, ErrorState, ProgressRing, Skeleton } from '@/ui-kit';

import { OVERVIEW } from '../../../../../config';
import { useOverviewMarks } from '../../../../../model/hooks';
import { MarksSummary } from '../../../MarksSummary';

import s from './MarksPanel.module.scss';

export const MarksPanel = () => {
  const t = useTranslations('profile.overview');
  const tMarks = useTranslations('profile.marks');
  const format = useFormatter();
  const { counts, closest, isPending, isError, isRetrying, retry } = useOverviewMarks();

  return (
    <Band aria-labelledby='profile-marks-band' className={s.band} innerClassName={s.inner}>
      <div className={s.summary}>
        <h2 className={s.title} id='profile-marks-band'>
          {t('marksTitle')}
        </h2>
        <ProgressRing
          label={t('marksRing', { count: counts.moe3, total: counts.tanksOwned })}
          marks={3}
          max={Math.max(counts.tanksOwned, 1)}
          size={OVERVIEW.marksRing.size}
          thickness={OVERVIEW.marksRing.thickness}
          value={counts.moe3}
        >
          <span className={s.total}>{format.number(counts.moe3)}</span>
          <span className={s.totalLabel}>{t('marksOf', { total: counts.tanksOwned })}</span>
        </ProgressRing>
        <MarksSummary counts={counts} />
      </div>
      <div className={s.closest}>
        <h3 className={s.heading}>{t('closestTitle')}</h3>
        {isPending && <Skeleton height={OVERVIEW.listSkeletonHeight} shape='block' />}
        {isError && <ErrorState isCompact isRetrying={isRetrying} onRetry={retry} />}
        {!isPending && !isError && closest.length === 0 && <EmptyState isCompact title={t('closestEmpty')} />}
        {closest.length > 0 && (
          <ol className={s.grid}>
            {closest.map(({ vehicle, percent, progress, nextMark, nextMarks, damageToNext }) => (
              <li key={vehicle.tankId} className={s.card}>
                <ProgressRing
                  label={tMarks('toNext', { percent: nextMark, damage: format.number(damageToNext) })}
                  marks={nextMarks}
                  max={1}
                  size={OVERVIEW.closestRing.size}
                  thickness={OVERVIEW.closestRing.thickness}
                  value={progress}
                >
                  <MarkOfExcellenceIcon aria-hidden marks={nextMarks} size={22} />
                </ProgressRing>
                <div className={s.body}>
                  <TankCell className={s.tank} image='contour' vehicle={vehicle} />
                  <span className={s.percent}>{format.number(percent, { maximumFractionDigits: 2 })}%</span>
                  <span className={s.next}>{tMarks('toNext', { percent: nextMark, damage: format.number(damageToNext) })}</span>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </Band>
  );
};
