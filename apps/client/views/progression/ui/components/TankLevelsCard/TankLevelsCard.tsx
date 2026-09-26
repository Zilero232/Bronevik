'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { TankCell } from '@/entities/tank/tank';
import { Card, CardHeader, EmptyState, ErrorState, ProgressBar, Skeleton } from '@/ui-kit';

import { PROGRESS_PAGE } from '../../../config';
import { useTankLevels } from '../../../model/hooks';

import s from './TankLevelsCard.module.scss';

export const TankLevelsCard = () => {
  const t = useTranslations('progression.tanks');
  const format = useFormatter();
  const { rows, isPending, isError, isRetrying, retry } = useTankLevels();

  return (
    <Card className={s.root} padding='lg'>
      <CardHeader title={t('title')} />
      <p className={s.description}>{t('description')}</p>
      {isPending && <Skeleton height={PROGRESS_PAGE.skeletonHeight} shape='block' />}
      {isError && <ErrorState isCompact isRetrying={isRetrying} onRetry={retry} />}
      {!isPending && !isError && rows.length === 0 && <EmptyState isCompact title={t('empty')} />}
      {rows.length > 0 && (
        <ul className={s.list}>
          {rows.map((row) => (
            <li key={row.key} className={s.row}>
              <div className={s.tank}>
                {row.vehicle ? <TankCell image='contour' vehicle={row.vehicle} /> : <span className={s.unknown}>#{row.tankId}</span>}
              </div>
              <span className={s.level}>{t('level', { level: row.level })}</span>
              <ProgressBar
                className={s.bar}
                max={row.progress.max}
                size='sm'
                tone='steel'
                value={row.progress.value}
                valueLabel={row.nextLevelXp === null ? t('maxLevel') : t('xp', { xp: format.number(row.xp), next: format.number(row.nextLevelXp) })}
              />
              <span className={s.battles}>{t('battles', { count: row.battles })}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};
