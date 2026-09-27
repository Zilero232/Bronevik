'use client';

import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { DataTable, EmptyState, ErrorState } from '@/ui-kit';

import { useOfferReturns } from '../../../model/hooks';

export const ReturnsTable = () => {
  const t = useTranslations('shop.returns');
  const { rows, columns, isPending, isError, isRetrying, retry } = useOfferReturns();

  if (isError) {
    return <ErrorState isCompact description={t('errorDescription')} isRetrying={isRetrying} title={t('errorTitle')} onRetry={retry} />;
  }

  return (
    <DataTable
      caption={t('caption')}
      columns={columns}
      data={rows}
      density='media'
      emptyState={<EmptyState isCompact description={t('emptyDescription')} title={t('emptyTitle')} />}
      getRowId={(row) => String(row.tankId)}
      getRowLink={({ vehicle }) => (vehicle ? { href: ROUTES.tanks.detail(vehicle.slug), label: vehicle.name } : null)}
      initialSorting={[{ id: 'next', desc: false }]}
      isLoading={isPending}
      summary={t('summary')}
    />
  );
};
