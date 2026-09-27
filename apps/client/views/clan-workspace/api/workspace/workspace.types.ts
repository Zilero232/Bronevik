import type { ClanWorkspaceControllerGetData, WeeklyReport, Workspace } from '@/shared/api/generated';

export type ClanWorkspace = Workspace;

export type WorkspaceRole = Workspace['role'];

export type WorkspaceReport = WeeklyReport;

export type WorkspaceScope = ClanWorkspaceControllerGetData['path'];

export type WorkspaceInput = WorkspaceScope & {
  signal?: AbortSignal;
};
