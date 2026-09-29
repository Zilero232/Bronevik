'use client';

import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { VehicleFilters } from '@/features/tank/filter-vehicles';
import { ROUTES } from '@/shared/constants';
import { DataTable, FilteredEmptyState, FilterField, QueryState, SegmentedControl, Skeleton } from '@/ui-kit';

import type { ModeTanksProps } from './ModeTanks.types';

import { MODE_TABLE, MODE_VIEWS } from '../../../config';
import { useModeTanks } from '../../../model/hooks';
import { ModeTankCard, RankGroups } from './components';

import s from './ModeTanks.module.scss';

export const ModeTanks = ({ mode }: ModeTanksProps) => {
  const t = useTranslations('modes.table');
  const { view, onViewChange, columns, rows, groups, minBattles, query, isFiltered, onReset } = useModeTanks(mode);

  const emptyState = (
    <FilteredEmptyState
      description={isFiltered ? undefined : t('emptyDescription', { battles: minBattles ?? 0 })}
      isFiltered={isFiltered}
      title={isFiltered ? t('filteredEmptyTitle') : t('emptyTitle')}
      onReset={onReset}
    />
  );

  return (
    <section className={s.root}>
      <VehicleFilters>
        <FilterField label={t('view')}>
          <SegmentedControl
            aria-label={t('view')}
            options={MODE_VIEWS.map((value) => ({ value, label: t(`views.${value}`) }))}
            value={view}
            onChange={onViewChange}
          />
        </FilterField>
      </VehicleFilters>
      <QueryState
        skeleton={
          view === 'table' ? (
            <DataTable isLoading columns={columns} data={[]} rowHeight={MODE_TABLE.rowHeight} />
          ) : (
            <Skeleton height={MODE_TABLE.skeletonHeight} shape='block' />
          )
        }
        errorDescription={t('errorDescription')}
        errorTitle={t('errorTitle')}
        query={query}
      >
        {match({ view, hasGroups: groups.length > 0 })
          .with({ view: 'table' }, () => (
            <DataTable
              caption={t('caption', { count: rows.length })}
              columns={columns}
              data={rows}
              emptyState={emptyState}
              getRowId={(row) => String(row.vehicle.tankId)}
              getRowLink={(row) => ({ href: ROUTES.tanks.detail(row.vehicle.slug), label: row.vehicle.name })}
              initialSorting={[{ id: 'score', desc: true }]}
              renderCard={(row) => <ModeTankCard tank={row} />}
              rowHeight={MODE_TABLE.rowHeight}
            />
          ))
          .with({ hasGroups: true }, () => <RankGroups groups={groups} />)
          .otherwise(() => emptyState)}
      </QueryState>
      {minBattles !== null && <p className={s.note}>{t('rankNote', { battles: minBattles })}</p>}
    </section>
  );
};
