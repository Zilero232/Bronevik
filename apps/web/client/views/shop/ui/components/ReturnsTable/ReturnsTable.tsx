'use client';

import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { DataTable, EmptyState, QueryState } from '@/ui-kit';

import { useOfferReturns } from '../../../model/hooks';

export const ReturnsTable = () => {
  const t = useTranslations('shop.returns');
  const { rows, columns, query } = useOfferReturns();

  return (
    <QueryState
      isCompact
      empty={<EmptyState isCompact description={t('emptyDescription')} title={t('emptyTitle')} />}
      errorDescription={t('errorDescription')}
      errorTitle={t('errorTitle')}
      query={query}
      skeleton={<DataTable isLoading caption={t('caption')} columns={columns} data={[]} density='media' />}
    >
      <DataTable
        caption={t('caption')}
        columns={columns}
        data={rows}
        density='media'
        getRowId={(row) => String(row.tankId)}
        getRowLink={({ vehicle }) => (vehicle ? { href: ROUTES.tanks.detail(vehicle.slug), label: vehicle.name } : null)}
        initialSorting={[{ id: 'next', desc: false }]}
        summary={t('summary')}
      />
    </QueryState>
  );
};
