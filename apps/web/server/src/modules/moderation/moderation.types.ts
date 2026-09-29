import type { z } from 'zod';

import type { ContentReport, Prisma } from '../../../generated';
import type { Owned, OwnedById } from '../community-core';
import type {
  contentReportSchema,
  createReportSchema,
  moderateSchema,
  moderationTargetParamsSchema,
  resolveReportSchema
} from './dto/moderation.schemas';

export type ContentReportView = z.infer<typeof contentReportSchema>;
export type CreateReportRequest = z.output<typeof createReportSchema> & Owned;
export type ResolveReportRequest = z.output<typeof resolveReportSchema> & OwnedById;
export type ModerateInput = z.output<typeof moderationTargetParamsSchema> & z.output<typeof moderateSchema>;

export type HideTargetInput = Pick<ContentReport, 'targetId' | 'targetType'> & { db: Prisma.TransactionClient };
