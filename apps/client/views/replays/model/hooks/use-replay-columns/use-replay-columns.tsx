'use client';

import type { ColumnDef } from '@tanstack/react-table';

import { createColumnHelper } from '@tanstack/react-table';
import { useFormatter, useTranslations } from 'next-intl';

import type { Replay } from '@/shared/api/replays';

import { vehicleIndex } from '@/entities/tank/tank';
import { ReplayResultBadge, useReplayModeLabel } from '@/features/community/replay-meta';
import { useVehicleCatalog } from '@/features/tank/pick-tank';
import { ROUTES } from '@/shared/constants';
import { RelativeTime } from '@/ui-kit';

import { ReplayMapCell, ReplayOwnerCell, ReplayTankCell } from '../../../ui/components/ReplayBrowser/components';

const column = createColumnHelper<Replay>();

export const useReplayColumns = (): ColumnDef<Replay, never>[] => {
  const t = useTranslations('replays.list');
  const format = useFormatter();
  const modeLabel = useReplayModeLabel();
  const { data: catalog } = useVehicleCatalog();

  const vehicles = vehicleIndex(catalog);
  const numberOrDash = (value: number | null) => (value === null ? '—' : format.number(value));

  return [
    column.display({
      id: 'tank',
      header: t('columns.tank'),
      cell: ({ row: { original } }) => <ReplayTankCell vehicle={original.owner ? (vehicles[original.owner.tankId] ?? null) : null} />,
      meta: { width: 220 }
    }),
    column.display({
      id: 'map',
      header: t('columns.map'),
      cell: ({ row: { original } }) => (
        <ReplayMapCell
          href={ROUTES.replay(original.id)}
          isFailed={original.status === 'failed'}
          mapName={original.mapName ?? original.arenaId ?? t('unknownMap')}
          mode={original.battleType}
          modeLabel={original.battleType ? modeLabel(original.battleType) : null}
          statusLabel={original.status === 'parsed' ? null : t(`status.${original.status}`)}
        />
      )
    }),
    column.accessor('result', {
      header: t('columns.result'),
      enableSorting: false,
      cell: (info) => <ReplayResultBadge result={info.getValue()} />,
      meta: { width: 96 }
    }),
    column.accessor('damageDealt', {
      header: t('columns.damage'),
      enableSorting: false,
      cell: (info) => numberOrDash(info.getValue()),
      meta: { align: 'end', isNumeric: true }
    }),
    column.accessor('damageAssisted', {
      header: t('columns.assist'),
      enableSorting: false,
      cell: (info) => numberOrDash(info.getValue()),
      meta: { align: 'end', isNumeric: true }
    }),
    column.accessor('frags', {
      header: t('columns.frags'),
      enableSorting: false,
      cell: (info) => numberOrDash(info.getValue()),
      meta: { align: 'end', isNumeric: true }
    }),
    column.accessor('xp', {
      header: t('columns.xp'),
      enableSorting: false,
      cell: (info) => numberOrDash(info.getValue()),
      meta: { align: 'end', isNumeric: true }
    }),
    column.display({
      id: 'owner',
      header: t('columns.owner'),
      cell: ({ row: { original } }) => <ReplayOwnerCell clanTag={original.owner?.clanTag ?? null} nickname={original.owner?.nickname ?? null} />
    }),
    column.accessor('playedAt', {
      header: t('columns.playedAt'),
      enableSorting: false,
      cell: ({ row: { original } }) => <RelativeTime value={original.playedAt ?? original.createdAt} />,
      meta: { align: 'end' }
    })
  ];
};
