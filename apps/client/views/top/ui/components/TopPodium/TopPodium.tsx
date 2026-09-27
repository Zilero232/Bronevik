'use client';

import { MasteryIcon } from '@otmetki/icons';
import { useTranslations } from 'next-intl';

import { Podium, PodiumCard } from '@/ui-kit';

import { useTopBoard } from '../../../model/hooks';
import { EntrantCell, ValueCell } from '../TopTable/components';

import s from './TopPodium.module.scss';

export const TopPodium = () => {
  const t = useTranslations('top');
  const { filter, podium, isRefreshing } = useTopBoard();

  if (podium.length === 0) {
    return null;
  }

  return (
    <div className={s.root} data-refreshing={isRefreshing}>
      <Podium aria-label={t('podium.title')}>
        {podium.map((entry) => (
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
    </div>
  );
};
