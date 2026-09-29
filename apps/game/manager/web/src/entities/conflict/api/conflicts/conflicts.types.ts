import type { z } from 'zod';

import type { conflictReportSchema } from './conflicts.schemas';

export type ConflictReport = z.infer<typeof conflictReportSchema>;
