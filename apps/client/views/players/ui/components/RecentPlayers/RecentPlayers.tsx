'use client';

import { useTranslations } from 'next-intl';
import { useId } from 'react';

import { Button, Card, CardHeader, DataTable } from '@/ui-kit';

import { useRecentColumns, useRecentList } from '../../../model/hooks';

export const RecentPlayers = () => {
  const t = useTranslations('players.recent');
  const titleId = useId();
  const { players, clear, isVisible } = useRecentList();
  const columns = useRecentColumns();

  if (!isVisible) {
    return null;
  }

  return (
    <Card aria-labelledby={titleId} padding='none'>
      <CardHeader
        action={
          <Button size='sm' variant='ghost' onClick={clear}>
            {t('clear')}
          </Button>
        }
        title={<span id={titleId}>{t('title')}</span>}
      />
      <DataTable columns={columns} data={players} density='compact' getRowId={(row) => String(row.accountId)} />
    </Card>
  );
};
