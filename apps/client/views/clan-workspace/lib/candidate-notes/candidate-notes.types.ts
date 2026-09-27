import type { z } from 'zod';

import type { candidateNotesSchema } from './candidate-notes.schemas';

export type CandidateNotesValues = z.input<typeof candidateNotesSchema>;

export type CandidateNotesPatch = z.output<typeof candidateNotesSchema>;
