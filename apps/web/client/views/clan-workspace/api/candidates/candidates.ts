import {
  clanWorkspaceControllerAddCandidate,
  clanWorkspaceControllerCandidates,
  clanWorkspaceControllerRemoveCandidate,
  clanWorkspaceControllerUpdateCandidate
} from '@/shared/api/generated';
import { SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

import type { AddCandidateInput, CandidateScope, ListCandidatesInput, UpdateCandidateInput, WorkspaceCandidate } from './candidates.types';

export const listCandidates = ({ clanId, status, signal }: ListCandidatesInput): Promise<WorkspaceCandidate[]> =>
  fromSdk(() => clanWorkspaceControllerCandidates({ ...SESSION_REQUEST, path: { clanId }, query: status ? { status } : {}, signal }));

export const addCandidate = ({ clanId, candidate }: AddCandidateInput): Promise<WorkspaceCandidate> =>
  fromSdk(() => clanWorkspaceControllerAddCandidate({ ...SESSION_REQUEST, path: { clanId }, body: candidate }));

export const updateCandidate = ({ clanId, id, patch }: UpdateCandidateInput): Promise<WorkspaceCandidate> =>
  fromSdk(() => clanWorkspaceControllerUpdateCandidate({ ...SESSION_REQUEST, path: { clanId, id }, body: patch }));

export const removeCandidate = async ({ clanId, id }: CandidateScope): Promise<void> => {
  await fromSdk(() => clanWorkspaceControllerRemoveCandidate({ ...SESSION_REQUEST, path: { clanId, id } }));
};
