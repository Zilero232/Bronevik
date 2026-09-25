'use client';

import { useTranslations } from 'next-intl';

import { Button, DataTable, EmptyState } from '@/ui-kit';

import { usePlayerTanks, useTankColumns, useTanksFilter } from '../../../model/hooks';
import { TabState } from '../TabState';
import { TanksFilters } from './components';

import s from './TanksTab.module.scss';

const INITIAL_SORTING = [{ id: 'battles', desc: true }];

export const TanksTab = () => {
  const t = useTranslations('profile.tanks');
  const filters = useTanksFilter();
  const { data: page, isPending, isError } = usePlayerTanks(filters.request);
  const columns = useTankColumns();

  const rows = page?.items.filter(({ vehicle }) => filters.matches(vehicle.name)) ?? [];

  return (
    <div className={s.root}>
      <TanksFilters filters={filters} total={rows.length} />
      {isError ? (
        <TabState kind='error' />
      ) : (
        <DataTable
          emptyState={
            <EmptyState
              action={
                <Button size='sm' variant='secondary' onClick={filters.reset}>
                  {t('reset')}
                </Button>
              }
              description={t('emptyDescription')}
              title={t('emptyTitle')}
            />
          }
          caption={t('caption')}
          columns={columns}
          data={rows}
          getRowId={(row) => String(row.vehicle.tankId)}
          initialSorting={INITIAL_SORTING}
          isLoading={isPending}
        />
      )}
    </div>
  );
};
