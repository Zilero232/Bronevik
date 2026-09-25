'use client';

import { useTranslations } from 'next-intl';

import { Skeleton } from '@/ui-kit';

import { OVERVIEW } from '../../../../../config';
import { tankHighlights } from '../../../../../lib/tank-highlights';
import { usePlayerTanks } from '../../../../../model/hooks';
import { TabCard } from '../../../TabCard';
import { TabState } from '../../../TabState';
import { HighlightList } from '../HighlightList';

import s from './TankHighlightsCard.module.scss';

export const TankHighlightsCard = () => {
  const t = useTranslations('profile.overview');
  const { data: tanks, isPending, isError } = usePlayerTanks();

  const { best, worst } = tankHighlights({ rows: tanks?.items ?? [], count: OVERVIEW.highlightCount, minBattles: OVERVIEW.highlightMinBattles });

  return (
    <TabCard eyebrow={t('highlightsEyebrow')} title={t('highlightsTitle')}>
      {isPending && <Skeleton height={260} shape='block' />}
      {isError && <TabState kind='error' />}
      {tanks && best.length === 0 && worst.length === 0 && <TabState kind='empty' />}
      {tanks && (best.length > 0 || worst.length > 0) && (
        <div className={s.root}>
          <HighlightList kind='best' rows={best} />
          <HighlightList kind='worst' rows={worst} />
        </div>
      )}
    </TabCard>
  );
};
