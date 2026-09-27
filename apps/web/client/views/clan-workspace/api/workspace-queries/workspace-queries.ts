import { queryOptions } from '@tanstack/react-query';

import { getClan } from '@/entities/clan/clan';
import { QUERY_KEYS } from '@/shared/constants';

import type { WorkspaceCandidatesQueryInput, WorkspaceEventsQueryInput } from './workspace-queries.types';

import { WORKSPACE_VIEW } from '../../config';
import { listCandidates } from '../candidates';
import { listWorkspaceEvents } from '../events';
import { getWorkspace, getWorkspaceReport } from '../workspace';

export const workspaceQueries = {
  clan: (tag: string) =>
    queryOptions({
      queryKey: QUERY_KEYS.clans.page(tag),
      queryFn: ({ signal }) => getClan({ idOrTag: tag, signal }),
      staleTime: WORKSPACE_VIEW.staleMs
    }),
  workspace: (clanId: number) =>
    queryOptions({
      queryKey: QUERY_KEYS.clanWorkspace.workspace(clanId),
      queryFn: ({ signal }) => getWorkspace({ clanId, signal }),
      staleTime: WORKSPACE_VIEW.staleMs
    }),
  events: ({ clanId, from, to }: WorkspaceEventsQueryInput) =>
    queryOptions({
      queryKey: QUERY_KEYS.clanWorkspace.events({ clanId, params: { from, to } }),
      queryFn: ({ signal }) => listWorkspaceEvents({ clanId, from, to, signal }),
      staleTime: WORKSPACE_VIEW.staleMs
    }),
  candidates: ({ clanId, status }: WorkspaceCandidatesQueryInput) =>
    queryOptions({
      queryKey: QUERY_KEYS.clanWorkspace.candidates({ clanId, params: { status } }),
      queryFn: ({ signal }) => listCandidates({ clanId, status, signal }),
      staleTime: WORKSPACE_VIEW.staleMs
    }),
  report: (clanId: number) =>
    queryOptions({
      queryKey: QUERY_KEYS.clanWorkspace.report(clanId),
      queryFn: ({ signal }) => getWorkspaceReport({ clanId, signal }),
      staleTime: WORKSPACE_VIEW.staleMs
    })
};
