'use client';

import { MasteryIcon } from '@otmetki/icons';
import { useTranslations } from 'next-intl';

import { Podium, PodiumCard } from '@/ui-kit';

import type { TopPodiumProps } from './TopPodium.types';

import { EntrantCell, ValueCell } from '../TopTable/components';

export const TopPodium = ({ entries, filter }: TopPodiumProps) => {
  const t = useTranslations('top');

  return (
    <Podium aria-label={t('podium.title')}>
      {entries.map((entry) => (
        <PodiumCard
          key={`${entry.rank}-${entry.name}`}
          glyph={<MasteryIcon level='master' />}
          meta={t('podium.battles', { count: entry.battles })}
          metricLabel={filter.scope === 'marks' ? t('marksLabel') : t(`metrics.${filter.metric}`)}
          name={<EntrantCell badge={null} entry={entry} />}
          rank={entry.rank}
          rankLabel={t('podium.place', { rank: entry.rank })}
          value={<ValueCell isHero entry={entry} filter={filter} />}
        />
      ))}
    </Podium>
  );
};
