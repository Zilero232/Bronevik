'use client';

import { useTranslations } from 'next-intl';

import { VehicleFilters } from '@/features/tank/filter-vehicles';
import { DataTable, ErrorState, SegmentedControl, Skeleton } from '@/ui-kit';

import type { ModeTanksProps } from './ModeTanks.types';

import { MODE_TABLE, MODE_VIEWS } from '../../../config';
import { useModeTanks } from '../../../model/hooks';
import { ModeTanksEmpty, RankGroups } from './components';

import s from './ModeTanks.module.scss';

export const ModeTanks = ({ mode }: ModeTanksProps) => {
  const t = useTranslations('modes.table');
  const { view, onViewChange, columns, rows, groups, minBattles, isLoading, isError, isRetrying, isFiltered, onReset, onRetry, onRowClick } =
    useModeTanks(mode);

  const emptyState = <ModeTanksEmpty isFiltered={isFiltered} minBattles={minBattles} onReset={onReset} />;

  return (
    <section className={s.root}>
      <div className={s.toolbar}>
        <VehicleFilters withPremium={false} />
        <SegmentedControl
          aria-label={t('view')}
          options={MODE_VIEWS.map((value) => ({ value, label: t(`views.${value}`) }))}
          size='sm'
          value={view}
          onChange={onViewChange}
        />
      </div>
      {isError && <ErrorState description={t('errorDescription')} isRetrying={isRetrying} title={t('errorTitle')} onRetry={onRetry} />}
      {!isError && view === 'table' && (
        <DataTable
          caption={t('caption', { count: rows.length })}
          columns={columns}
          data={rows}
          emptyState={emptyState}
          getRowId={(row) => String(row.vehicle.tankId)}
          initialSorting={[{ id: 'score', desc: true }]}
          isLoading={isLoading}
          rowHeight={MODE_TABLE.rowHeight}
          onRowClick={onRowClick}
        />
      )}
      {!isError && view === 'ranks' && isLoading && <Skeleton height={MODE_TABLE.skeletonHeight} shape='block' />}
      {!isError && view === 'ranks' && !isLoading && (groups.length > 0 ? <RankGroups groups={groups} /> : emptyState)}
      {minBattles !== null && <p className={s.note}>{t('rankNote', { battles: minBattles })}</p>}
    </section>
  );
};
