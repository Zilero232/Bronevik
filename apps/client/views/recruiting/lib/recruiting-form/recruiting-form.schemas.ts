import { z } from 'zod';

import { requirementsFormSchema } from '@/features/community/stat-requirements';
import { zCreateRecruiting } from '@/shared/api/recruiting';

export const recruitingFormSchema = z.object({
  accountId: z.string(),
  title: zCreateRecruiting.shape.title,
  body: zCreateRecruiting.shape.body,
  requirements: requirementsFormSchema,
  expiresInDays: z.string()
});
