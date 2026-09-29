'use client';

import { useTranslations } from 'next-intl';

import { EmptyState, QueryState, Skeleton, Timeline } from '@/ui-kit';

import { TANK_PAGE, TANK_SECTIONS, VERDICT_TONES } from '../../../config';
import { useTankPatches } from '../../../model/hooks';
import { TankSection } from '../TankSection';
import { PatchEntry } from './components';

import s from './PatchHistory.module.scss';

export const PatchHistory = () => {
  const t = useTranslations('tank.patches');
  const query = useTankPatches();

  return (
    <TankSection id={TANK_SECTIONS.patches} title={t('title')}>
      <QueryState
        empty={<EmptyState description={t('emptyDescription')} title={t('emptyTitle')} />}
        query={query}
        skeleton={<Skeleton height={TANK_PAGE.skeletonRows * TANK_PAGE.rowHeight} shape='block' width='100%' />}
      >
        {(entries) => (
          <Timeline
            className={s.list}
            items={entries.map((entry) => ({ id: entry.version, tone: VERDICT_TONES[entry.verdict], content: <PatchEntry entry={entry} /> }))}
          />
        )}
      </QueryState>
    </TankSection>
  );
};
