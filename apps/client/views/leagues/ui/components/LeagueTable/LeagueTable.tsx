'use client';

import { useTranslations } from 'next-intl';

import { DataTable, Legend } from '@/ui-kit';

import type { LeagueTableProps } from './LeagueTable.types';

import { LEAGUE_LEGEND, LEAGUE_ZONE_TINTS } from '../../../config';
import { useLeagueColumns } from '../../../model/hooks';
import { LeagueCard } from './components';

import s from './LeagueTable.module.scss';

export const LeagueTable = ({ metric, entries, scope }: LeagueTableProps) => {
  const t = useTranslations('social.leagues');
  const columns = useLeagueColumns({ metric, scope });

  return (
    <div className={s.root}>
      <DataTable
        caption={t('caption')}
        columns={columns}
        data={entries}
        density='compact'
        getRowId={(row) => String(row.accountId)}
        renderCard={(row) => <LeagueCard metric={metric} row={row} showTier={scope === 'friends'} />}
        rowTint={(row) => (row.isMe ? 'self' : row.zone ? LEAGUE_ZONE_TINTS[row.zone] : null)}
      />
      <Legend aria-label={t('legend.label')} items={LEAGUE_LEGEND[scope].map(({ key, tone }) => ({ key, tone, label: t(`legend.${key}`) }))} />
    </div>
  );
};
