'use client';

import { useTranslations } from 'next-intl';

import { TankCard } from '@/entities/tank/tank';
import { ROUTES } from '@/shared/constants';
import { Button, DataTable, EmptyState, SegmentedControl } from '@/ui-kit';

import type { TableMode } from '../../../model/hooks';

import { useTableSection } from '../../../model/hooks';
import { DesignBlock } from '../DesignBlock';

export const TableSection = () => {
  const t = useTranslations('design.table');
  const { columns, mode, setMode, modeOptions, rows, isError, isLoading, retry } = useTableSection();

  return (
    <DesignBlock
      action={<SegmentedControl<TableMode> aria-label={t('mode')} options={modeOptions} size='sm' value={mode} onChange={setMode} />}
      id='table'
      title={t('title')}
    >
      {isError ? (
        <EmptyState action={<Button onClick={retry}>{t('retry')}</Button>} description={t('errorBody')} title={t('errorTitle')} />
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
          isLoading={isLoading}
          renderCard={(row) => <TankCard row={row} />}
        />
      )}
    </DesignBlock>
  );
};
