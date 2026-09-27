import type { z } from 'zod';

import type { ReplaySummary } from '../../../../lib/replay';
import type { modVisibilitySchema } from './mod-upload.schemas';

export type ModVisibility = z.infer<typeof modVisibilitySchema>;

export type RecordedByInput = {
  summary: ReplaySummary;
  accountId: bigint;
};
