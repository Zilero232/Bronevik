'use client';

import type { MoeRow } from '@bronevik/schemas';
import type { ColumnDef } from '@tanstack/react-table';

import { MasteryIcon } from '@bronevik/icons';
import { createColumnHelper } from '@tanstack/react-table';
import { ChevronRight } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { TankIdentity, vehicleIdentity } from '@/entities/tank/tank';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { DeltaValue, IconButton } from '@/ui-kit';

import type { UseMoeColumnsInput } from './MarksTable.types';

import { thresholdVerdict } from '../../../lib/moe-thresholds';
import { ThresholdSpark } from './components';

import s from './MarksTable.module.scss';

const column = createColumnHelper<MoeRow>();

const NUMERIC = { align: 'end', isNumeric: true } as const;

export const useMoeColumns = ({ onOpen, sparks, isSparkReady }: UseMoeColumnsInput): ColumnDef<MoeRow, never>[] => {
  const t = useTranslations('marks.table.columns');
  const format = useFormatter();

  const damage = (value: number | null | undefined, className = s.value) =>
    value === null || value === undefined ? <span className={s.dim}>—</span> : <span className={className}>{format.number(value)}</span>;

  return [
    column.accessor((row) => row.vehicle.name, {
      id: 'tank',
      header: t('tank'),
      cell: ({ row }) => (
        <Link className={s.tankLink} href={ROUTES.tank(row.original.vehicle.slug)} onClick={(event) => event.stopPropagation()}>
          <TankIdentity image='contour' tank={vehicleIdentity(row.original.vehicle)} />
        </Link>
      ),
      meta: { width: '26%' }
    }),
    column.accessor((row) => row.moe?.p65 ?? 0, { id: 'p65', header: '65%', cell: ({ row }) => damage(row.original.moe?.p65), meta: NUMERIC }),
    column.accessor((row) => row.moe?.p85 ?? 0, { id: 'p85', header: '85%', cell: ({ row }) => damage(row.original.moe?.p85), meta: NUMERIC }),
    column.accessor((row) => row.moe?.p95 ?? 0, { id: 'p95', header: '95%', cell: ({ row }) => damage(row.original.moe?.p95, s.key), meta: NUMERIC }),
    column.accessor((row) => row.moe?.p100 ?? 0, { id: 'p100', header: '100%', cell: ({ row }) => damage(row.original.moe?.p100), meta: NUMERIC }),
    column.accessor((row) => row.trend.p95Delta30d ?? 0, {
      id: 'delta',
      header: t('delta'),
      cell: ({ row }) => <DeltaValue value={row.original.trend.p95Delta30d ?? 0} verdict={thresholdVerdict(row.original.trend.p95Delta30d)} />,
      meta: { align: 'end' }
    }),
    column.display({
      id: 'history',
      header: t('history'),
      cell: ({ row }) => <ThresholdSpark points={sparks.get(row.original.vehicle.tankId) ?? (isSparkReady ? [] : undefined)} />,
      meta: { align: 'center' }
    }),
    column.accessor((row) => row.mastery?.master ?? 0, {
      id: 'master',
      header: t('master'),
      cell: ({ row }) => (
        <span className={s.master}>
          <MasteryIcon aria-hidden tinted level='master' size={16} />
          {row.original.mastery ? format.number(row.original.mastery.master) : '—'}
        </span>
      ),
      meta: NUMERIC
    }),
    column.display({
      id: 'details',
      header: () => <span className={s.srOnly}>{t('details')}</span>,
      cell: ({ row }) => (
        <IconButton
          aria-label={t('detailsLabel', { tank: row.original.vehicle.name })}
          size='sm'
          onClick={(event) => {
            event.stopPropagation();
            onOpen(row.original);
          }}
        >
          <ChevronRight size={16} />
        </IconButton>
      ),
      meta: { align: 'end' }
    })
  ];
};
