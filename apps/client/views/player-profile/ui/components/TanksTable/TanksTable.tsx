'use client';

import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { DataTable, FilteredEmptyState } from '@/ui-kit';

import type { TanksTableProps } from './TanksTable.types';

import { TANKS_TABLE } from '../../../config';
import { useTanksFilterContext } from '../../../model/context';
import { useTanksTableColumns } from '../../../model/hooks';
import { PlayerTankCard } from './components';

export const TanksTable = ({ rows, isLoading }: TanksTableProps) => {
  const t = useTranslations('profile.tanks');
  const { isDirty, reset } = useTanksFilterContext();
  const columns = useTanksTableColumns();

  return (
    <DataTable
      caption={t('caption')}
      columns={columns}
      data={rows}
      density='media'
      emptyState={<FilteredEmptyState isFiltered={isDirty} title={t('emptyTitle')} onReset={reset} />}
      getRowId={(row) => String(row.vehicle.tankId)}
      getRowLink={(row) => ({ href: ROUTES.tanks.detail(row.vehicle.slug), label: row.vehicle.name })}
      initialSorting={TANKS_TABLE.initialSorting}
      isLoading={isLoading}
      renderCard={(row) => <PlayerTankCard row={row} />}
    />
  );
};
