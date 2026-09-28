'use client';

import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { DataTable } from '@/ui-kit';

import type { WatchlistTableProps } from './WatchlistTable.types';

import { WATCHLIST_PAGE } from '../../../config';
import { useWatchlistTable } from '../../../model/hooks';

export const WatchlistTable = ({ players }: WatchlistTableProps) => {
  const t = useTranslations('watchlist.table');
  const { columns } = useWatchlistTable();

  return (
    <DataTable
      caption={t('caption')}
      columns={columns}
      data={players}
      density='compact'
      getRowId={({ accountId }) => String(accountId)}
      getRowLink={({ nickname }) => (nickname ? { href: ROUTES.players.profile(nickname), label: nickname, hasCellLink: true } : null)}
      initialSorting={[...WATCHLIST_PAGE.initialSorting]}
    />
  );
};
