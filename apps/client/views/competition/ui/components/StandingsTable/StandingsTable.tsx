'use client';

import { useTranslations } from 'next-intl';

import { Card, CardHeader, DataTable, EmptyState, RelativeTime } from '@/ui-kit';

import type { StandingsTableProps } from './StandingsTable.types';

import { useStandingsColumns } from '../../../model/hooks';

export const StandingsTable = ({ competition }: StandingsTableProps) => {
  const t = useTranslations('competitions.standings');
  const columns = useStandingsColumns({ myTeamId: competition.myTeamId, battlesPerPlayer: competition.battlesPerPlayer });

  return (
    <Card padding='none'>
      <CardHeader meta={<RelativeTime fallback={t('notScored')} value={competition.scoredAt} />} title={t('title')} />
      {competition.standings.length === 0 ? (
        <EmptyState isCompact description={t('emptyDescription')} title={t('emptyTitle')} />
      ) : (
        <DataTable caption={t('caption')} columns={columns} data={competition.standings} getRowId={({ id }) => id} />
      )}
    </Card>
  );
};
