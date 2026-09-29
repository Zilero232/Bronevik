import { countSchema, uuidSchema } from '@otmetki/schemas';
import { z } from 'zod';

export const arenaIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(64)
  .regex(/^[\w-]+$/);

export const playerStatsSchema = z.object({
  battles: countSchema,
  wn8: z.number().nullable(),
  winRate: z.number().min(0).max(1).nullable()
});

export const idParamsSchema = z.object({ id: uuidSchema });

export const slugParamsSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .regex(/^[\w-]+$/)
});

export const moderationStatusSchema = z.enum(['draft', 'pending', 'published', 'rejected', 'hidden']);

export const postStatusSchema = z.enum(['open', 'closed', 'expired', 'hidden']);

export const likeResultSchema = z.object({ liked: z.boolean(), likesCount: countSchema });
