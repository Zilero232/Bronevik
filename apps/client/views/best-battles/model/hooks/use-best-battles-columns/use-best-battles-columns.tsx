'use client';

import type { ColumnDef } from '@tanstack/react-table';

import { createColumnHelper } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

import type { BestBattle } from '@/entities/battle/best-battle';

import { TankCell } from '@/entities/tank/tank';

import type { UseBestBattlesColumnsInput } from './use-best-battles-columns.types';

import { MapCell, MedalsCell, MetricCell, PlayerCell, ReplayCell } from '../../../ui/components/BestBattlesTable/components';

const column = createColumnHelper<BestBattle>();

export const useBestBattlesColumns = ({ metric }: UseBestBattlesColumnsInput): ColumnDef<BestBattle, never>[] => {
  const t = useTranslations('bestBattles');

  const rank = column.accessor('rank', {
    header: '#',
    meta: { width: 56, align: 'end', isRank: true }
  });

  const tank = column.display({
    id: 'tank',
    header: t('columns.tank'),
    cell: ({ row: { original } }) => <TankCell vehicle={original.vehicle} />,
    meta: { isMedia: true }
  });

  const player = column.accessor('nickname', {
    header: t('columns.player'),
    cell: ({ row: { original } }) => <PlayerCell battle={original} />
  });

  const map = column.display({
    id: 'map',
    header: t('columns.map'),
    cell: ({ row: { original } }) => <MapCell battle={original} />,
    meta: { hideBelow: 'md' }
  });

  const value = column.accessor((row) => row[metric], {
    id: 'value',
    header: t(`metrics.${metric}`),
    cell: (info) => <MetricCell value={info.getValue()} />,
    meta: { align: 'end', isNumeric: true, bar: { tone: 'accent' } }
  });

  const damage =
    metric === 'damage'
      ? []
      : [
          column.accessor('damage', {
            header: t('metrics.damage'),
            cell: (info) => <MetricCell isSecondary value={info.getValue()} />,
            meta: { align: 'end', isNumeric: true, hideBelow: 'lg' }
          })
        ];

  const medals = column.display({
    id: 'medals',
    header: t('columns.medals'),
    cell: ({ row: { original } }) => <MedalsCell medals={original.medals} />,
    meta: { hideBelow: 'lg' }
  });

  const replay = column.display({
    id: 'replay',
    header: t('columns.replay'),
    cell: ({ row: { original } }) => <ReplayCell replayId={original.replayId} />,
    meta: { align: 'end' }
  });

  return [rank, tank, player, map, value, ...damage, medals, replay];
};
