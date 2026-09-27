import type { WorkspaceEvent, WorkspaceScope } from '../../../api';

export type UseEventActionsInput = WorkspaceScope & {
  event: WorkspaceEvent;
};
