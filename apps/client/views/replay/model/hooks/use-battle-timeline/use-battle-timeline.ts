'use client';

import { useTranslations } from 'next-intl';

import type { Replay } from '@/entities/replay/replay';
import type { ChartSeries } from '@/ui-kit';

import { BATTLE_TIMELINE } from '../../../config';
import { aliveSeries, formatClock, killEvents } from '../../../lib/battle-timeline';
import { recorderTeamOf } from '../../../lib/team-split';

export const useBattleTimeline = (replay: Replay) => {
  const t = useTranslations('replays.timeline');

  const recorderTeam = recorderTeamOf(replay);
  const alive = aliveSeries({
    players: replay.players,
    recorderTeam,
    durationSec: replay.durationSec,
    maxPoints: BATTLE_TIMELINE.maxPoints,
    minStepSec: BATTLE_TIMELINE.minStepSec
  });

  const series: ChartSeries[] = alive
    ? [
        { id: 'allies', label: t('allies'), values: alive.allies, tone: 'good' },
        { id: 'enemies', label: t('enemies'), values: alive.enemies, tone: 'bad' }
      ]
    : [];

  const teamSize = Math.max(0, ...(alive ? [...alive.allies, ...alive.enemies] : []));
  const yDomain: [number, number] = [0, Math.max(1, teamSize)];

  return {
    hasData: alive !== null,
    labels: alive?.times.map(formatClock) ?? [],
    series,
    yDomain,
    kills: killEvents({ players: replay.players, recorderTeam }).map((event) => ({
      id: `${event.victim.accountId}-${event.timeSec}`,
      time: formatClock(event.timeSec),
      victim: event.victim.nickname,
      killer: event.killer?.nickname ?? null,
      isAllyLoss: event.isAllyLoss
    })),
    formatValue: (value: number) => String(Math.round(value))
  };
};
