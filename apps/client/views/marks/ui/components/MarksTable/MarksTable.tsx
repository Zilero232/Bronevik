'use client';

import { SearchX } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { DataTable, EmptyState } from '@/ui-kit';

import type { MarksTableProps } from './MarksTable.types';

import { MOE_LIST } from '../../../config';
import { useMoeSparks } from '../../../model/hooks';
import { useMoeColumns } from './MarksTable.columns';

import s from './MarksTable.module.scss';

export const MarksTable = ({ rows, isLoading, isStale, onSelect }: MarksTableProps) => {
  const t = useTranslations('marks.table');
  const { sparks, isPending } = useMoeSparks(rows.map(({ vehicle }) => vehicle.tankId));
  const columns = useMoeColumns({ onOpen: onSelect, sparks, isSparkReady: !isPending });

  return (
    <div className={s.root} data-stale={isStale}>
      <DataTable
        caption={t('caption')}
        columns={columns}
        data={rows}
        emptyState={<EmptyState description={t('emptyHint')} icon={<SearchX size={28} />} title={t('empty')} />}
        getRowId={(row) => String(row.vehicle.tankId)}
        isLoading={isLoading}
        rowHeight={MOE_LIST.rowHeight}
        onRowClick={onSelect}
      />
      <p className={s.hint}>{t('dropHint')}</p>
    </div>
  );
};
