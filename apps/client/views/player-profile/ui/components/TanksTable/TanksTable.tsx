'use client';

import { useTranslations } from 'next-intl';

import { Button, DataTable, EmptyState } from '@/ui-kit';

import type { TanksTableProps } from './TanksTable.types';

import { TANKS_TABLE } from '../../../config';
import { useTanksTableColumns } from '../../../model/hooks';

export const TanksTable = ({ rows, isLoading, onReset }: TanksTableProps) => {
  const t = useTranslations('profile.tanks');
  const columns = useTanksTableColumns();

  return (
    <DataTable
      emptyState={
        <EmptyState
          action={
            <Button size='sm' variant='secondary' onClick={onReset}>
              {t('reset')}
            </Button>
          }
          title={t('emptyTitle')}
        />
      }
      caption={t('caption')}
      columns={columns}
      data={rows}
      density='media'
      getRowId={(row) => String(row.vehicle.tankId)}
      initialSorting={TANKS_TABLE.initialSorting}
      isLoading={isLoading}
    />
  );
};
