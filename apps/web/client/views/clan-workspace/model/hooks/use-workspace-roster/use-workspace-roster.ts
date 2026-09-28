'use client';

import { clanRoleSchema } from '@otmetki/schemas';
import { sortBy } from 'remeda';

import { useCommunityViewer } from '@/entities/auth/session';

import type { UseWorkspaceRosterInput, WorkspaceRosterRow } from './use-workspace-roster.types';

import { memberAttendance } from '../../../lib/attendance';
import { isOfficerRole } from '../../../lib/workspace-access';
import { useWorkspaceEvents } from '../use-workspace-events';

export const useWorkspaceRoster = ({ clanId, members }: UseWorkspaceRosterInput) => {
  const viewer = useCommunityViewer();
  const { query, past } = useWorkspaceEvents({ clanId, isEnabled: true });

  const rates = memberAttendance({ events: past, accountIds: members.map(({ accountId }) => accountId) });

  const rows: WorkspaceRosterRow[] = sortBy(
    members.map((member) => ({
      ...member,
      ...(rates.get(member.accountId) ?? { attended: 0, total: 0, rate: null }),
      isOfficer: isOfficerRole(member.role)
    })),
    (row) => clanRoleSchema.options.indexOf(row.role),
    (row) => row.nickname.toLowerCase()
  );

  return {
    query,
    rows,
    events: past.length,
    officers: rows.filter((row) => row.isOfficer).length,
    isLoading: query.isPending && query.fetchStatus !== 'idle',
    isError: query.isError,
    isRetrying: query.isRefetching,
    onRetry: () => void query.refetch(),
    rowTint: (row: WorkspaceRosterRow) => (viewer.ownsAccount(row.accountId) ? ('self' as const) : null)
  };
};
