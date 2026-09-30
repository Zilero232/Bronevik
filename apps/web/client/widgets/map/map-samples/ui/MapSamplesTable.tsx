'use client';

import { useTranslations } from 'next-intl';

import { DataTable, Skeleton } from '@/ui-kit';

import type { MapSamplesTableProps } from './MapSamplesTable.types';

import { useMapSamplesColumns } from '../model/hooks';

import s from './MapSamplesTable.module.scss';

export const MapSamplesTable = ({ rows, nameLabel, windowDays, minBattles, isLoading = false }: MapSamplesTableProps) => {
  const t = useTranslations('maps.samples');
  const columns = useMapSamplesColumns({ nameLabel, minBattles });

  return (
    <div aria-busy={isLoading} className={s.root}>
      <p className={s.meta}>{isLoading ? <Skeleton width='14em' /> : t('window', { days: windowDays, min: minBattles })}</p>
      <DataTable columns={columns} data={rows} getRowId={(row) => row.id} initialSorting={[{ id: 'battles', desc: true }]} isLoading={isLoading} />
    </div>
  );
};
