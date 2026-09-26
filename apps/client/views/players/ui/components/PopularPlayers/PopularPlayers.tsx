'use client';

import { useTranslations } from 'next-intl';
import { useId } from 'react';

import { ROUTES } from '@/shared/constants';
import { Card, CardHeader, DataTable, EmptyState, ErrorState } from '@/ui-kit';

import { usePopularColumns, usePopularPlayers } from '../../../model/hooks';

export const PopularPlayers = () => {
  const t = useTranslations('players.popular');
  const titleId = useId();
  const { items, days, isPending, isError, isRetrying, retry } = usePopularPlayers();
  const columns = usePopularColumns();

  return (
    <Card aria-labelledby={titleId} padding='none'>
      <CardHeader meta={t('description', { days })} title={<span id={titleId}>{t('title')}</span>} />
      {isError && items.length === 0 ? (
        <ErrorState isCompact isRetrying={isRetrying} title={t('errorTitle')} onRetry={retry} />
      ) : (
        <DataTable
          columns={columns}
          data={items}
          density='compact'
          emptyState={<EmptyState isCompact title={t('emptyTitle')} />}
          getRowId={(row) => String(row.accountId)}
          getRowLink={(row) => ({ href: ROUTES.players.profile(row.nickname), label: row.nickname })}
          isLoading={isPending}
        />
      )}
    </Card>
  );
};
