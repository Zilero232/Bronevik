import { isoDateTimeSchema, uuidSchema } from '@otmetki/schemas';
import { z } from 'zod';

import { moderationStatusSchema } from '../../community-core';
import { guideSchema } from '../../guides';

const reportTargetSchema = z.enum(['build', 'guide', 'comment', 'replay', 'platoon_post', 'recruiting_post', 'coach', 'tournament', 'tactic_board']);

export const createReportSchema = z.object({
  targetType: reportTargetSchema,
  targetId: z.string().trim().min(1).max(64),
  reason: z.enum(['spam', 'abuse', 'cheating', 'copyright', 'other']),
  details: z.string().trim().max(2000).optional()
});

export const contentReportSchema = z.object({
  id: uuidSchema,
  targetType: z.string(),
  targetId: z.string(),
  reason: z.string(),
  details: z.string().nullable(),
  status: z.enum(['open', 'resolved', 'dismissed']),
  reporterUserId: uuidSchema.nullable(),
  createdAt: isoDateTimeSchema,
  resolvedAt: isoDateTimeSchema.nullable()
});

export const reportsQuerySchema = z.object({ status: z.enum(['open', 'resolved', 'dismissed']).default('open') });

export const contentReportListSchema = z.array(contentReportSchema);

export const resolveReportSchema = z.object({
  status: z.enum(['resolved', 'dismissed']),
  hideTarget: z.boolean().default(false)
});

export const moderateSchema = z.object({
  status: moderationStatusSchema
});

export const moderationTargetParamsSchema = z.object({
  target: z.enum(['build', 'guide', 'comment']),
  id: uuidSchema
});

export const pendingGuidesSchema = z.array(guideSchema);
