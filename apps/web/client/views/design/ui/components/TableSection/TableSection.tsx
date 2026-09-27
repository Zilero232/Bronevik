'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { TankCard } from '@/entities/tank/tank';
import { ROUTES } from '@/shared/constants';
import { Button, DataTable, EmptyState, SegmentedControl } from '@/ui-kit';

import type { TableMode } from './TableSection.types';

import { useDesignTankStats, useTankColumns } from '../../../model/hooks';
import { DesignBlock } from '../DesignBlock';

export const TableSection = () => {
  const t = useTranslations('design.table');
  const columns = useTankColumns();
  const [mode, setMode] = useState<TableMode>('live');
  const { data, isLoading, isError, refetch } = useDesignTankStats();

  const rows = mode === 'live' ? (data?.items ?? []) : [];

  const switcher = (
    <SegmentedControl<TableMode>
      options={[
        { value: 'live', label: t('live') },
        { value: 'loading', label: t('loading') },
        { value: 'empty', label: t('empty') }
      ]}
      aria-label={t('mode')}
      size='sm'
      value={mode}
      onChange={setMode}
    />
  );

  return (
    <DesignBlock action={switcher} id='table' title={t('title')}>
      {mode === 'live' && isError ? (
        <EmptyState action={<Button onClick={() => refetch()}>{t('retry')}</Button>} description={t('errorBody')} title={t('errorTitle')} />
      ) : (
        <DataTable
          isMediaFirst
          key={mode}
          caption={t('caption', { count: rows.length })}
          columns={columns}
          data={rows}
          emptyState={<EmptyState description={t('emptyBody')} title={t('emptyTitle')} />}
          getRowClass={(row) => row.vehicle.type}
          getRowId={(row) => String(row.vehicle.tankId)}
          getRowLink={(row) => ({ href: ROUTES.tanks.detail(row.vehicle.slug), label: row.vehicle.name })}
          initialSorting={[{ id: 'winRate', desc: true }]}
          isLoading={mode === 'loading' || (mode === 'live' && isLoading)}
          renderCard={(row) => <TankCard row={row} />}
        />
      )}
    </DesignBlock>
  );
};
