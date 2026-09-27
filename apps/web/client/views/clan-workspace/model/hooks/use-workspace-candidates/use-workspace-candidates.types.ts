import type { WorkspaceScope } from '../../../api';

export type UseWorkspaceCandidatesInput = WorkspaceScope & {
  isEnabled: boolean;
};
