'use client';

import type { EconomyAccount } from '@otmetki/schemas';

import { useTranslations } from 'next-intl';

import { Button, DataTable, EmptyState, ErrorState, SegmentedControl, Switch } from '@/ui-kit';

import { TANKS_ECONOMY, TANKS_VIEW } from '../../../config';
import { useEconomyTable } from '../../../model/hooks';

import s from './EconomyTable.module.scss';

export const EconomyTable = () => {
  const t = useTranslations('tanks.economy');
  const {
    columns,
    rows,
    total,
    account,
    reserve,
    clanPayout,
    clanPayoutPercent,
    isLoading,
    isError,
    isFetching,
    isFiltered,
    onReset,
    onRetry,
    onRowClick,
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
      {isError ? (
        <ErrorState description={t('errorDescription')} isRetrying={isFetching} title={t('errorTitle')} onRetry={onRetry} />
      ) : (
        <DataTable
          emptyState={
            isFiltered ? (
              <EmptyState
                action={
                  <Button size='sm' variant='secondary' onClick={onReset}>
                    {t('resetFilters')}
                  </Button>
                }
                title={t('emptyFilteredTitle')}
              />
            ) : (
              <EmptyState description={t('emptyDescription')} title={t('emptyTitle')} />
            )
          }
          caption={t('caption', { count: total })}
          columns={columns}
          data={rows}
          getRowId={(row) => String(row.vehicle.tankId)}
          initialSorting={[{ id: 'credits', desc: true }]}
          isLoading={isLoading}
          rowHeight={TANKS_VIEW.rowHeight}
          onRowClick={onRowClick}
        />
      )}
      <p className={s.note}>{t('note')}</p>
    </section>
  );
};
