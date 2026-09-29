import type { z } from 'zod';

import type { lestaEnvelopeSchema, lestaMetaSchema } from './common.schemas';

export type LestaMeta = z.infer<typeof lestaMetaSchema>;
export type LestaEnvelope = z.infer<typeof lestaEnvelopeSchema>;
