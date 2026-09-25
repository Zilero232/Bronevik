'use client';

import type { PlayerTankRow } from '@bronevik/schemas';
import type { ColumnDef } from '@tanstack/react-table';

import { createColumnHelper } from '@tanstack/react-table';
import { useFormatter, useTranslations } from 'next-intl';

import { ratingValueTone, TankAwards, winRateTone } from '@/entities/player/stats';
import { TankIdentity, vehicleIdentity } from '@/entities/tank/tank';
import { percentText } from '@/shared/lib';
import { RatingBadge } from '@/ui-kit';

import s from './use-tank-columns.module.scss';

const column = createColumnHelper<PlayerTankRow>();

export const useTankColumns = (): ColumnDef<PlayerTankRow, never>[] => {
  const t = useTranslations('profile.tanks.columns');
  const format = useFormatter();

  const percent = (value: number | null) => percentText({ format, value, digits: 2 });

  return [
    column.accessor((row) => row.vehicle.name, {
      id: 'tank',
      header: t('tank'),
      cell: (info) => <TankIdentity image='contour' tank={vehicleIdentity(info.row.original.vehicle)} />,
      meta: { width: '28%' }
    }),
    column.accessor((row) => row.vehicle.tier, { id: 'tier', header: t('tier'), meta: { align: 'end', isNumeric: true } }),
    column.accessor('battles', { header: t('battles'), cell: (info) => format.number(info.getValue()), meta: { align: 'end', isNumeric: true } }),
    column.accessor((row) => row.winRate ?? 0, {
      id: 'winRate',
      header: t('winRate'),
      cell: (info) => (
        <RatingBadge size='sm' tone={winRateTone(info.row.original.winRate)} value={percent(info.row.original.winRate)} withPips={false} />
      ),
      meta: { align: 'end' }
    }),
    column.accessor((row) => row.avgDamage ?? 0, {
      id: 'avgDamage',
      header: t('avgDamage'),
      cell: (info) => format.number(info.getValue()),
      meta: { align: 'end', isNumeric: true }
    }),
    column.accessor((row) => row.wn8.value ?? 0, {
      id: 'wn8',
      header: 'WN8',
      cell: (info) => <RatingBadge size='sm' tone={ratingValueTone(info.row.original.wn8)} value={format.number(info.getValue())} withPips={false} />,
      meta: { align: 'end' }
    }),
    column.accessor((row) => (row.marksOnGun ?? 0) * 10 + row.markOfMastery, {
      id: 'awards',
      header: t('awards'),
      cell: (info) => <TankAwards markOfMastery={info.row.original.markOfMastery} marksOnGun={info.row.original.marksOnGun} />,
      meta: { align: 'center' }
    }),
    column.accessor((row) => row.moePercent ?? -1, {
      id: 'moe',
      header: t('moe'),
      cell: (info) => percentText({ format, value: info.row.original.moePercent }),
      meta: { align: 'end', isNumeric: true }
    }),
    column.accessor((row) => row.recent?.stats?.battles ?? 0, {
      id: 'recent',
      header: t('recent'),
      cell: (info) => {
        const stats = info.row.original.recent?.stats;

        return stats ? (
          <span className={s.recent}>
            {format.number(stats.battles)}
            <span className={s.recentRate} data-tone={winRateTone(stats.winRate)}>
              {percent(stats.winRate)}
            </span>
          </span>
        ) : (
          <span className={s.dim}>—</span>
        );
      },
      meta: { align: 'end' }
    })
  ];
};
