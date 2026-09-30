import type { z } from 'zod';

import type {
  librarySyncSchema,
  localSyncSchema,
  syncOutcomeSchema,
  syncReportSchema,
  syncResolutionSchema,
  syncStatusSchema
} from './site-sync.schemas';

export type LocalSync = z.infer<typeof localSyncSchema>;

export type SyncStatus = z.infer<typeof syncStatusSchema>;

export type SyncOutcome = z.infer<typeof syncOutcomeSchema>;

export type SyncResolution = z.infer<typeof syncResolutionSchema>;

export type LibrarySync = z.infer<typeof librarySyncSchema>;

export type SyncReport = z.infer<typeof syncReportSchema>;

export type SyncNowInput = {
  clientPath: string | null;
  resolution: SyncResolution | null;
};
