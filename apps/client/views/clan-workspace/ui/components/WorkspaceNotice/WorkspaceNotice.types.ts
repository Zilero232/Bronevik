import type { WorkspaceStatus } from '../../../lib/workspace-access';

export type WorkspaceNoticeProps = {
  status: Exclude<WorkspaceStatus, 'ready'>;
  clanTag: string;
  loginHref: string;
  canCreate: boolean;
  isCreating: boolean;
  isRetrying: boolean;
  onCreate: () => void;
  onRetry: () => void;
};
