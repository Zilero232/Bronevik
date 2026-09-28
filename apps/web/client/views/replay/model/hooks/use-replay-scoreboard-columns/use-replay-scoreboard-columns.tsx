'use client';

import { createColumnHelper } from '@tanstack/react-table';
import { useFormatter, useTranslations } from 'next-intl';

import type { ReplayPlayer } from '@/entities/replay/replay';
import type { TableColumn } from '@/ui-kit';

import { vehicleIndex } from '@/entities/tank/tank';
import { useVehicleCatalog } from '@/features/tank/pick-tank';
import { minutesClock } from '@/shared/lib';

import { REPLAY_SCOREBOARD } from '../../../config';
import { hitRate } from '../../../lib/team-split';
import { ScoreboardPlayerCell, ScoreboardTankCell } from '../../../ui/components/ReplayScoreboard/components';

const column = createColumnHelper<ReplayPlayer>();

export const useReplayScoreboardColumns = (): TableColumn<ReplayPlayer>[] => {
  const t = useTranslations('replays.scoreboard');
  const format = useFormatter();
  const { data: catalog } = useVehicleCatalog();

  const vehicles = vehicleIndex(catalog);
  const numberOrDash = (value: number | null) => (value === null ? '—' : format.number(value));

  return [
    column.display({
      id: 'tank',
      header: t('columns.tank'),
      cell: ({ row: { original } }) => <ScoreboardTankCell vehicle={vehicles[original.tankId] ?? null} />,
      meta: { width: 200 }
    }),
    column.display({
      id: 'player',
      header: t('columns.player'),
      cell: ({ row: { original } }) => (
        <ScoreboardPlayerCell
          clanTag={original.clanTag}
          isDestroyed={original.survived === false}
          isRecorder={original.isRecorder === true}
          nickname={original.nickname}
        />
      )
    }),
    ...REPLAY_SCOREBOARD.stats.map(({ key, label, meta }) =>
      column.accessor(key, {
        header: t(`columns.${label}`),
        enableSorting: false,
        cell: (info) => numberOrDash(info.getValue()),
        meta: { ...REPLAY_SCOREBOARD.numeric, ...meta }
      })
    ),
    column.display({
      id: 'hits',
      header: t('columns.hits'),
      cell: ({ row: { original } }) => {
        const rate = hitRate(original);

        return rate === null ? '—' : format.number(rate, { style: 'percent' });
      },
      meta: { ...REPLAY_SCOREBOARD.numeric, hideBelow: 'xl' }
    }),
    column.accessor('xp', {
      header: t('columns.xp'),
      enableSorting: false,
      cell: (info) => numberOrDash(info.getValue()),
      meta: { ...REPLAY_SCOREBOARD.numeric, hideBelow: 'lg' }
    }),
    column.accessor('lifeTimeSec', {
      header: t('columns.life'),
      enableSorting: false,
      cell: ({ row: { original } }) => (original.survived === false && original.lifeTimeSec !== null ? minutesClock(original.lifeTimeSec) : '—'),
      meta: { ...REPLAY_SCOREBOARD.numeric, hideBelow: 'xl' }
    })
  ];
};
