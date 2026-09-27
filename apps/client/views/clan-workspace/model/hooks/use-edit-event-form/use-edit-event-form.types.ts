import type { WorkspaceEvent, WorkspaceScope } from '../../../api';

export type UseEditEventFormInput = WorkspaceScope & {
  event: WorkspaceEvent;
};
