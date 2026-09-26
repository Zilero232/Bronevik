'use client';

import { useTranslations } from 'next-intl';

import { Button, Card, CardHeader, DataTable } from '@/ui-kit';

import { useRecentColumns, useRecentList } from '../../../model/hooks';

export const RecentPlayers = () => {
  const t = useTranslations('players.recent');
  const { players, clear, isVisible } = useRecentList();
  const columns = useRecentColumns();

  if (!isVisible) {
    return null;
  }

  return (
    <Card aria-labelledby='recent-players-title' padding='none'>
      <CardHeader
        action={
          <Button size='sm' variant='ghost' onClick={clear}>
            {t('clear')}
          </Button>
        }
        title={<span id='recent-players-title'>{t('title')}</span>}
      />
      <DataTable columns={columns} data={players} density='compact' getRowId={(row) => String(row.accountId)} />
    </Card>
  );
};
