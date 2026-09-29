'use client';

import { createColumnHelper } from '@tanstack/react-table';
import { useFormatter, useTranslations } from 'next-intl';

import type { Replay } from '@/entities/replay/replay';
import type { TableColumn } from '@/ui-kit';

import { ReplayResultBadge, useReplayMapName, useReplayModeLabel } from '@/features/community/replay-meta';
import { ROUTES } from '@/shared/constants';
import { RelativeTime } from '@/ui-kit';

import { ReplayMapCell, ReplayOwnerCell, ReplayTankCell } from '../../../ui/components/ReplayBrowser/components';
import { useReplayVehicle } from '../use-replay-vehicle';

const column = createColumnHelper<Replay>();

export const useReplayColumns = (): TableColumn<Replay>[] => {
  const t = useTranslations('replays.list');
  const format = useFormatter();
  const modeLabel = useReplayModeLabel();
  const vehicleOf = useReplayVehicle();
  const mapNameOf = useReplayMapName();
  const numberOrDash = (value: number | null) => (value === null ? '—' : format.number(value));

  return [
    column.display({
      id: 'tank',
      header: t('columns.tank'),
      cell: ({ row: { original } }) => <ReplayTankCell vehicle={vehicleOf(original)} />,
      meta: { width: 220 }
    }),
    column.display({
      id: 'map',
      header: t('columns.map'),
      cell: ({ row: { original } }) => (
        <ReplayMapCell
          href={ROUTES.replays.detail(original.id)}
          isFailed={original.status === 'failed'}
          mapName={mapNameOf(original) ?? t('unknownMap')}
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
      meta: { align: 'end', isNumeric: true, hideBelow: 'md' }
    }),
    column.accessor('frags', {
      header: t('columns.frags'),
      enableSorting: false,
      cell: (info) => numberOrDash(info.getValue()),
      meta: { align: 'end', isNumeric: true, hideBelow: 'sm' }
    }),
    column.accessor('xp', {
      header: t('columns.xp'),
      enableSorting: false,
      cell: (info) => numberOrDash(info.getValue()),
      meta: { align: 'end', isNumeric: true, hideBelow: 'lg' }
    }),
    column.display({
      id: 'owner',
      header: t('columns.owner'),
      cell: ({ row: { original } }) => <ReplayOwnerCell clanTag={original.owner?.clanTag ?? null} nickname={original.owner?.nickname ?? null} />,
      meta: { hideBelow: 'lg' }
    }),
    column.accessor('playedAt', {
      header: t('columns.playedAt'),
      enableSorting: false,
      cell: ({ row: { original } }) => <RelativeTime value={original.playedAt ?? original.createdAt} />,
      meta: { align: 'end', hideBelow: 'sm' }
    })
  ];
};
