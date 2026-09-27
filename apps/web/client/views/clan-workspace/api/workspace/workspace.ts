import { clanWorkspaceControllerCreate, clanWorkspaceControllerGet, clanWorkspaceControllerReport } from '@/shared/api/generated';
import { SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

import type { ClanWorkspace, WorkspaceInput, WorkspaceReport, WorkspaceScope } from './workspace.types';

export const getWorkspace = ({ clanId, signal }: WorkspaceInput): Promise<ClanWorkspace> =>
  fromSdk(() => clanWorkspaceControllerGet({ ...SESSION_REQUEST, path: { clanId }, signal }));

export const createWorkspace = ({ clanId }: WorkspaceScope): Promise<ClanWorkspace> =>
  fromSdk(() => clanWorkspaceControllerCreate({ ...SESSION_REQUEST, path: { clanId } }));

export const getWorkspaceReport = ({ clanId, signal }: WorkspaceInput): Promise<WorkspaceReport> =>
  fromSdk(() => clanWorkspaceControllerReport({ ...SESSION_REQUEST, path: { clanId }, signal }));
