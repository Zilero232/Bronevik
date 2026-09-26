'use client';

import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { Card, CardHeader, EmptyState, ErrorState, Skeleton, Timeline } from '@/ui-kit';

import { TANK_PAGE, TANK_SECTIONS, VERDICT_TONES } from '../../../config';
import { useTankPatches } from '../../../model/hooks';
import { PatchEntry } from './components';

import s from './PatchHistory.module.scss';

export const PatchHistory = () => {
  const t = useTranslations('tank.patches');
  const { data: entries, isPending, isError, refetch } = useTankPatches();

  return (
    <Card className={s.root} id={TANK_SECTIONS.patches} padding='none'>
      <CardHeader className={s.header} title={t('title')} />
      {match({ list: entries ?? [], isPending, isError })
        .with({ isPending: true }, () => <Skeleton height={TANK_PAGE.skeletonRows * TANK_PAGE.rowHeight} shape='block' width='100%' />)
        .with({ isError: true }, () => <ErrorState onRetry={() => void refetch()} />)
        .with({ list: [] }, () => <EmptyState description={t('emptyDescription')} title={t('emptyTitle')} />)
        .otherwise(({ list }) => (
          <Timeline
            className={s.list}
            items={list.map((entry) => ({ id: entry.version, tone: VERDICT_TONES[entry.verdict], content: <PatchEntry entry={entry} /> }))}
          />
        ))}
    </Card>
  );
};
