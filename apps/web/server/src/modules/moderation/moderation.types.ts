import type { z } from 'zod';

import type { ModerationStatus, Prisma } from '../../../generated';
import type { Owned, OwnedById } from '../community-core';
import type { contentReportSchema, createReportSchema, resolveReportSchema } from './dto/moderation.schemas';

export type ContentReportView = z.infer<typeof contentReportSchema>;
export type CreateReportRequest = z.output<typeof createReportSchema> & Owned;
export type ResolveReportRequest = z.output<typeof resolveReportSchema> & OwnedById;
export type ModerateInput = { target: 'build' | 'comment' | 'guide'; id: string; status: ModerationStatus };

export type HideTargetInput = {
  targetType: string;
  targetId: string;
  db: Prisma.TransactionClient;
};
