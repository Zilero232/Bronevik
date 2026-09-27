'use client';

import { useTranslations } from 'next-intl';

import { DataTable, EmptyState } from '@/ui-kit';

import type { MarksTableProps } from './MarksTable.types';

import { MOE_LIST } from '../../../config';
import { useMarksColumns } from '../../../model/hooks';

import s from './MarksTable.module.scss';

export const MarksTable = ({ rows, isLoading, isStale, onSelect }: MarksTableProps) => {
  const t = useTranslations('marks.table');
  const columns = useMarksColumns(onSelect);

  return (
    <div className={s.root} data-stale={isStale}>
      <DataTable
        caption={t('caption')}
        columns={columns}
        data={rows}
        emptyState={<EmptyState description={t('emptyHint')} title={t('empty')} />}
        getRowId={(row) => String(row.vehicle.tankId)}
        isLoading={isLoading}
        rowHeight={MOE_LIST.rowHeight}
        onRowClick={onSelect}
      />
    </div>
  );
};
