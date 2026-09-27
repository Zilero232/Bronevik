'use client';

import { QueryState } from '@/ui-kit';

import { useTanksTab } from '../../../model/hooks';
import { TanksTable } from '../TanksTable';
import { TanksFilters } from './components';

import s from './TanksTab.module.scss';

export const TanksTab = () => {
  const { filters, query, rows } = useTanksTab();

  return (
    <div className={s.root}>
      <TanksFilters filters={filters} total={rows.length} />
      <QueryState query={query} skeleton={<TanksTable isLoading filters={filters} rows={rows} />}>
        <TanksTable filters={filters} rows={rows} />
      </QueryState>
    </div>
  );
};
