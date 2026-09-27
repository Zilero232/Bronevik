import type { WorkspaceCandidate, WorkspaceScope } from '../../../api';

export type UseCandidateActionsInput = WorkspaceScope & {
  candidate: WorkspaceCandidate;
};
