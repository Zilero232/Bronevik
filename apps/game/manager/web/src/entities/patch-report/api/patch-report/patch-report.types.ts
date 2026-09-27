import type { z } from 'zod';

import type { patchReportSchema, patchStatusSchema } from './patch-report.schemas';

export type PatchStatus = z.infer<typeof patchStatusSchema>;

export type PatchStatusKind = PatchStatus['kind'];

export type PatchReport = z.infer<typeof patchReportSchema>;
