import type { WorkspaceScope } from '../../../api';

export type UseWorkspaceEventsInput = WorkspaceScope & {
  isEnabled: boolean;
};
