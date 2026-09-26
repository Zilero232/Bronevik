'use client';

import { ErrorState } from '@/ui-kit';

import { useTanksTab } from '../../../model/hooks';
import { TanksTable } from '../TanksTable';
import { TanksFilters } from './components';

import s from './TanksTab.module.scss';

export const TanksTab = () => {
  const { filters, rows, isPending, isError, isRetrying, retry } = useTanksTab();

  return (
    <div className={s.root}>
      <TanksFilters filters={filters} total={rows.length} />
      {isError ? <ErrorState isRetrying={isRetrying} onRetry={retry} /> : <TanksTable isLoading={isPending} rows={rows} onReset={filters.reset} />}
    </div>
  );
};
