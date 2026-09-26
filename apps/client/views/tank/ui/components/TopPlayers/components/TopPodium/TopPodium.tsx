'use client';

import { useTranslations } from 'next-intl';

import { PlayerIdentity } from '@/entities/player/player';
import { ROUTES } from '@/shared/constants';
import { Podium, PodiumCard } from '@/ui-kit';

import type { TopPodiumProps } from './TopPodium.types';

export const TopPodium = ({ rows, metricLabel }: TopPodiumProps) => {
  const t = useTranslations('tank.players');

  return (
    <Podium aria-label={t('podiumLabel')}>
      {rows.map((row) => (
        <PodiumCard
          key={row.key}
          href={ROUTES.players.profile(row.player.nickname)}
          meta={t('battles', { battles: row.battles })}
          metricLabel={metricLabel}
          name={<PlayerIdentity player={row.player} />}
          rank={row.rank}
          rankLabel={t('rank', { rank: row.rank })}
          tone={row.tone}
          value={row.value}
        />
      ))}
    </Podium>
  );
};
