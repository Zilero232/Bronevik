'use client';

import type { EconomyAccount } from '@otmetki/schemas';

import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { DataTable, FilteredEmptyState, QueryState, SegmentedControl, Switch } from '@/ui-kit';

import { TANKS_ECONOMY, TANKS_VIEW } from '../../../config';
import { useEconomyTable } from '../../../model/hooks';
import { EconomyCard } from './components';

import s from './EconomyTable.module.scss';

export const EconomyTable = () => {
  const t = useTranslations('tanks.economy');
  const {
    columns,
    view,
    query,
    account,
    reserve,
    clanPayout,
    clanPayoutPercent,
    isFiltered,
    onReset,
    onAccountChange,
    onReserveChange,
    onClanPayoutChange
  } = useEconomyTable();

  return (
    <section aria-label={t('title')} className={s.root}>
      <div className={s.controls}>
        <SegmentedControl<EconomyAccount>
          aria-label={t('account')}
          options={TANKS_ECONOMY.accounts.map((value) => ({ value, label: t(`accounts.${value}`) }))}
          size='sm'
          value={account}
          onChange={onAccountChange}
        />
        <Switch checked={reserve} label={t('reserve')} onCheckedChange={onReserveChange} />
        <Switch checked={clanPayout} label={t('clanPayout', { percent: clanPayoutPercent })} onCheckedChange={onClanPayoutChange} />
      </div>
      <QueryState
        errorDescription={t('errorDescription')}
        errorTitle={t('errorTitle')}
        query={query}
        skeleton={<DataTable isLoading caption={t('caption', { count: 0 })} columns={columns} data={[]} rowHeight={TANKS_VIEW.rowHeight} />}
      >
        {({ items, total }) => (
          <DataTable
            emptyState={
              <FilteredEmptyState
                description={isFiltered ? undefined : t('emptyDescription')}
                isFiltered={isFiltered}
                title={isFiltered ? t('emptyFilteredTitle') : t('emptyTitle')}
                onReset={onReset}
              />
            }
            caption={t('caption', { count: total })}
            columns={columns}
            data={items}
            getRowId={(row) => String(row.vehicle.tankId)}
            getRowLink={(row) => ({ href: ROUTES.tanks.detail(row.vehicle.slug), label: row.vehicle.name })}
            initialSorting={[{ id: 'credits', desc: true }]}
            renderCard={(row) => <EconomyCard row={row} view={view(row)} />}
            rowHeight={TANKS_VIEW.rowHeight}
          />
        )}
      </QueryState>
      <p className={s.note}>{t('note')}</p>
    </section>
  );
};
