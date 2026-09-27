import type { WorkspaceCandidate } from '../../api';
import type { CandidateNotesValues } from './candidate-notes.types';

export const toCandidateNotesValues = (candidate: Pick<WorkspaceCandidate, 'notes'>): CandidateNotesValues => ({ notes: candidate.notes ?? '' });

export const candidateNickname = (candidate: Pick<WorkspaceCandidate, 'stats'>): string | null => candidate.stats?.nickname ?? null;
