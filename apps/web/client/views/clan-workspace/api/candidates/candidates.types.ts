import type {
  Candidate,
  ClanWorkspaceControllerCandidatesData,
  ClanWorkspaceControllerUpdateCandidateData,
  CreateCandidate,
  UpdateCandidate
} from '@/shared/api/generated';

export type WorkspaceCandidate = Candidate;

export type CandidateStatus = Candidate['status'];

export type CandidateScope = ClanWorkspaceControllerUpdateCandidateData['path'];

export type ListCandidatesInput = ClanWorkspaceControllerCandidatesData['path'] &
  NonNullable<ClanWorkspaceControllerCandidatesData['query']> & {
    signal?: AbortSignal;
  };

export type AddCandidateInput = ClanWorkspaceControllerCandidatesData['path'] & {
  candidate: CreateCandidate;
};

export type UpdateCandidateInput = CandidateScope & {
  patch: UpdateCandidate;
};
