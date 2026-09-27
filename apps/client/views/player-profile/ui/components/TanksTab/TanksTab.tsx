'use client';

import { QueryState } from '@/ui-kit';

import { useTanksTab } from '../../../model/hooks';
import { TanksTable } from '../TanksTable';
import { TanksFilters } from './components';

import s from './TanksTab.module.scss';

export const TanksTab = () => {
  const { query, rows } = useTanksTab();

  return (
    <div className={s.root}>
      <TanksFilters total={rows.length} />
      <QueryState query={query} skeleton={<TanksTable isLoading rows={rows} />}>
        <TanksTable rows={rows} />
      </QueryState>
    </div>
  );
};
