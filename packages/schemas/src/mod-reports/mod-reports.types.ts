import type { z } from 'zod';

import type { modProblemReportFileSchema, modProblemReportReceiptSchema, modProblemReportRequestSchema } from './mod-reports.schemas';

export type ModProblemReportFile = z.infer<typeof modProblemReportFileSchema>;
export type ModProblemReportRequest = z.infer<typeof modProblemReportRequestSchema>;
export type ModProblemReportReceipt = z.infer<typeof modProblemReportReceiptSchema>;
