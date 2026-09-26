import { z } from 'zod';

import { zCreateComment } from '@/shared/api/comments';

export const commentFormSchema = z.object({
  body: z.string().trim().pipe(zCreateComment.shape.body)
});
