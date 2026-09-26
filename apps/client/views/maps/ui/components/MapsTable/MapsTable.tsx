'use client';

import { useTranslations } from 'next-intl';

import { Button, DataTable, EmptyState } from '@/ui-kit';

import type { MapsTableProps } from './MapsTable.types';

import { useMapsColumns } from '../../../model/hooks';

export const MapsTable = ({ maps, isPending, isFiltered, onReset }: MapsTableProps) => {
  const t = useTranslations('maps.grid');
  const columns = useMapsColumns();

  return (
    <DataTable
      emptyState={
        isFiltered ? (
          <EmptyState
            isCompact
            action={
              <Button size='sm' variant='secondary' onClick={onReset}>
                {t('reset')}
              </Button>
            }
            title={t('noMatchTitle')}
          />
        ) : (
          <EmptyState isCompact title={t('emptyTitle')} />
        )
      }
      columns={columns}
      data={maps}
      getRowId={(map) => map.arenaId}
      initialSorting={[{ id: 'name', desc: false }]}
      isLoading={isPending}
    />
  );
};
