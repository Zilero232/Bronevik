import type { ListCandidatesInput } from '../candidates';
import type { ListEventsInput } from '../events';

export type WorkspaceEventsQueryInput = Omit<ListEventsInput, 'signal'>;

export type WorkspaceCandidatesQueryInput = Omit<ListCandidatesInput, 'signal'>;
