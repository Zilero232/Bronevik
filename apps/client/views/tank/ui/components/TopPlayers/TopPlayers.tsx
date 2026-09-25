'use client';

import type { TopPlayersMetric } from '@bronevik/schemas';

import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { SectionHeader, SegmentedControl, Skeleton } from '@/ui-kit';

import { TANK_PAGE, TANK_SECTIONS, TOP_METRICS } from '../../../config';
import { useTank } from '../../../model/context';
import { useTankTopPlayers } from '../../../model/hooks';
import { RevealSection } from '../RevealSection';
import { SectionNotice } from '../SectionNotice';
import { TopPlayerRow } from './components';

import s from './TopPlayers.module.scss';

export const TopPlayers = () => {
  const t = useTranslations('tank.players');
  const { identity } = useTank();
  const { metric, setMetric, top, isPending, isError, isPlaceholderData } = useTankTopPlayers();

  const options = TOP_METRICS.map((value) => ({ value, label: t(`metrics.${value}`) }));

  const onMetricChange = (value: TopPlayersMetric) => {
    void setMetric(value);
  };

  return (
    <RevealSection id={TANK_SECTIONS.players}>
      <SectionHeader
        action={
          <SegmentedControl<TopPlayersMetric> aria-label={t('metricLabel')} options={options} size='sm' value={metric} onChange={onMetricChange} />
        }
        description={t('description')}
        eyebrow={t('eyebrow')}
        index='// 03'
        title={t('title')}
      />
      {match({ entries: top?.entries ?? [], isPending, isError })
        .with({ isPending: true }, () => (
          <div className={s.skeleton}>
            {Array.from({ length: TANK_PAGE.skeletonRows }, (_, index) => (
              <Skeleton key={index} height={56} shape='block' width='100%' />
            ))}
          </div>
        ))
        .with({ isError: true }, () => <SectionNotice kind='error' />)
        .with({ entries: [] }, () => <SectionNotice kind='empty' title={t('emptyTitle')} />)
        .otherwise(({ entries }) => (
          <ol aria-busy={isPlaceholderData} aria-label={t('caption', { name: identity.name })} className={s.list} data-stale={isPlaceholderData}>
            {entries.map((entry, index) => (
              <TopPlayerRow key={`${metric}-${entry.rank}-${entry.name}`} entry={entry} index={index} metric={metric} />
            ))}
          </ol>
        ))}
    </RevealSection>
  );
};
