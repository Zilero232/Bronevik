'use client';

import { MarkOfExcellenceIcon } from '@otmetki/icons';
import { useFormatter, useTranslations } from 'next-intl';

import { TankCell } from '@/entities/tank/tank';
import { EmptyState, ErrorState, Skeleton } from '@/ui-kit';

import { OVERVIEW } from '../../../../../config';
import { useOverviewMarks } from '../../../../../model/hooks';
import { MarksSummary } from '../../../MarksSummary';
import { ProfilePanel } from '../../../ProfilePanel';

import s from './MarksPanel.module.scss';

export const MarksPanel = () => {
  const t = useTranslations('profile.overview');
  const tMarks = useTranslations('profile.marks');
  const format = useFormatter();
  const { counts, closest, isPending, isError, isRetrying, retry } = useOverviewMarks();

  return (
    <ProfilePanel title={t('marksTitle')}>
      <div className={s.root}>
        <MarksSummary counts={counts} />
        <h4 className={s.heading}>{t('closestTitle')}</h4>
        {isPending && <Skeleton height={OVERVIEW.listSkeletonHeight} shape='block' />}
        {isError && <ErrorState isCompact isRetrying={isRetrying} onRetry={retry} />}
        {!isPending && !isError && closest.length === 0 && <EmptyState isCompact title={t('closestEmpty')} />}
        {closest.length > 0 && (
          <ol className={s.list}>
            {closest.map(({ vehicle, percent, nextMark, nextMarks, damageToNext }) => (
              <li key={vehicle.tankId} className={s.row}>
                <TankCell className={s.tank} image='contour' vehicle={vehicle} />
                <span className={s.percent}>{format.number(percent, { maximumFractionDigits: 2 })}%</span>
                <MarkOfExcellenceIcon aria-hidden className={s.glyph} marks={nextMarks} size={16} />
                <span className={s.next}>{tMarks('toNext', { percent: nextMark, damage: format.number(damageToNext) })}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </ProfilePanel>
  );
};
