import { z } from 'zod';

import { zCreateReport } from '@/shared/api/moderation';

export const reportFormSchema = z.object({
  reason: zCreateReport.shape.reason,
  details: z.string().trim().pipe(zCreateReport.shape.details.unwrap())
});
