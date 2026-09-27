'use client';

import { useTranslations } from 'next-intl';

import { DataTable, SectionHeader } from '@/ui-kit';

import type { WorkspaceRosterProps } from './WorkspaceRoster.types';

import { WORKSPACE_VIEW } from '../../../config';
import { useWorkspaceRoster, useWorkspaceRosterColumns } from '../../../model/hooks';
import { RosterCard } from './components';

import s from './WorkspaceRoster.module.scss';

export const WorkspaceRoster = ({ clanId, members }: WorkspaceRosterProps) => {
  const t = useTranslations('clanWorkspace.roster');
  const columns = useWorkspaceRosterColumns();
  const { query, rows, events, officers } = useWorkspaceRoster({ clanId, members });

  return (
    <div className={s.root}>
      <SectionHeader
        count={rows.length}
        id='workspace-roster'
        meta={t('meta', { officers, events, days: WORKSPACE_VIEW.historyDays })}
        title={t('title')}
      />
      <DataTable
        caption={t('caption')}
        columns={columns}
        data={rows}
        density='compact'
        getRowId={(row) => String(row.accountId)}
        isLoading={query.isPending && query.fetchStatus !== 'idle'}
        renderCard={(row) => <RosterCard row={row} />}
        rowTint={(row) => (row.isOfficer ? 'self' : null)}
      />
    </div>
  );
};
