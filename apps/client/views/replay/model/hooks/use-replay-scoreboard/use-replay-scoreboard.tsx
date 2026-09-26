'use client';

import type { ColumnDef } from '@tanstack/react-table';

import { createColumnHelper } from '@tanstack/react-table';
import { useFormatter, useTranslations } from 'next-intl';

import type { Replay, ReplayPlayer } from '@/entities/replay/replay';

import { vehicleIndex } from '@/entities/tank/tank';
import { useVehicleCatalog } from '@/features/tank/pick-tank';

import { formatClock } from '../../../lib/battle-timeline';
import { hitRate, splitTeams, teamTotals } from '../../../lib/team-split';
import { ScoreboardPlayerCell, ScoreboardTankCell } from '../../../ui/components/ReplayScoreboard/components';

const column = createColumnHelper<ReplayPlayer>();

export const useReplayScoreboard = (replay: Replay) => {
  const t = useTranslations('replays.scoreboard');
  const format = useFormatter();
  const { data: catalog } = useVehicleCatalog();

  const vehicles = vehicleIndex(catalog);
  const split = splitTeams(replay);
  const numberOrDash = (value: number | null) => (value === null ? '—' : format.number(value));
  const numeric = { align: 'end', isNumeric: true } as const;

  const columns: ColumnDef<ReplayPlayer, never>[] = [
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
    column.accessor('damageDealt', {
      header: t('columns.damage'),
      enableSorting: false,
      cell: (info) => numberOrDash(info.getValue()),
      meta: { ...numeric, bar: { tone: 'accent' } }
    }),
    column.accessor('damageAssisted', {
      header: t('columns.assist'),
      enableSorting: false,
      cell: (info) => numberOrDash(info.getValue()),
      meta: { ...numeric, hideBelow: 'md' }
    }),
    column.accessor('damageBlocked', {
      header: t('columns.blocked'),
      enableSorting: false,
      cell: (info) => numberOrDash(info.getValue()),
      meta: { ...numeric, hideBelow: 'lg' }
    }),
    column.accessor('frags', { header: t('columns.frags'), enableSorting: false, cell: (info) => numberOrDash(info.getValue()), meta: numeric }),
    column.accessor('spotted', {
      header: t('columns.spotted'),
      enableSorting: false,
      cell: (info) => numberOrDash(info.getValue()),
      meta: { ...numeric, hideBelow: 'lg' }
    }),
    column.display({
      id: 'hits',
      header: t('columns.hits'),
      cell: ({ row: { original } }) => {
        const rate = hitRate(original);

        return rate === null ? '—' : format.number(rate, { style: 'percent' });
      },
      meta: { ...numeric, hideBelow: 'xl' }
    }),
    column.accessor('xp', {
      header: t('columns.xp'),
      enableSorting: false,
      cell: (info) => numberOrDash(info.getValue()),
      meta: { ...numeric, hideBelow: 'lg' }
    }),
    column.accessor('lifeTimeSec', {
      header: t('columns.life'),
      enableSorting: false,
      cell: ({ row: { original } }) => (original.survived === false && original.lifeTimeSec !== null ? formatClock(original.lifeTimeSec) : '—'),
      meta: { ...numeric, hideBelow: 'xl' }
    })
  ];

  return {
    columns,
    teams: [
      { id: 'allies', players: split.allies, totals: teamTotals(split.allies) },
      { id: 'enemies', players: split.enemies, totals: teamTotals(split.enemies) }
    ] as const
  };
};
