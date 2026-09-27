'use client';

import { Flame } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { TankCell } from '@/entities/tank/tank';
import { ROUTES } from '@/shared/constants';
import { Podium, PodiumCard } from '@/ui-kit';

import type { BestBattlesPodiumProps } from './BestBattlesPodium.types';

import s from './BestBattlesPodium.module.scss';

export const BestBattlesPodium = ({ battles, metric }: BestBattlesPodiumProps) => {
  const t = useTranslations('bestBattles');
  const format = useFormatter();

  return (
    <Podium aria-label={t('podium.title')}>
      {battles.map((battle) => (
        <PodiumCard
          key={battle.key}
          meta={
            <span className={s.meta}>
              <TankCell image='contour' vehicle={battle.vehicle} />
              <span className={s.map}>{battle.arena?.name ?? t('unknownMap')}</span>
            </span>
          }
          glyph={<Flame size={120} />}
          href={battle.replayId ? ROUTES.replays.detail(battle.replayId) : ROUTES.players.profile(battle.nickname)}
          metricLabel={t(`metrics.${metric}`)}
          name={battle.nickname}
          rank={battle.rank}
          rankLabel={t('podium.place', { rank: battle.rank })}
          value={battle[metric] === null ? '—' : format.number(battle[metric])}
        />
      ))}
    </Podium>
  );
};
