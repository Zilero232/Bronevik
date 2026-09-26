import type { z } from 'zod';

import type { CommentTarget, Prisma } from '../../../generated';
import type { Owned, OwnedById, Viewer } from '../community-core';
import type { GUIDE_INCLUDE } from './config';
import type {
  commentSchema,
  createCommentSchema,
  createGuideSchema,
  guideAuthorSchema,
  guidePageSchema,
  guideSchema,
  guidesQuerySchema,
  updateGuideSchema
} from './dto/guides.schemas';

export type GuideView = z.infer<typeof guideSchema>;
export type GuidesQuery = z.output<typeof guidesQuerySchema> & Viewer;
export type GuidePage = z.infer<typeof guidePageSchema>;
export type CreateGuideRequest = z.output<typeof createGuideSchema> & Owned;
export type UpdateGuideRequest = z.output<typeof updateGuideSchema> & OwnedById;
export type GuideAuthor = z.infer<typeof guideAuthorSchema>;
export type GuideBySlugInput = { slug: string } & Viewer;
export type GuideRow = Prisma.GuideGetPayload<{ include: typeof GUIDE_INCLUDE }>;
export type GuideViewsInput = { rows: GuideRow[] } & Viewer;

export type CommentView = z.infer<typeof commentSchema>;
export type ListCommentsInput = { target: CommentTarget; targetId: string } & Viewer;
export type CreateCommentRequest = Omit<z.output<typeof createCommentSchema>, 'target'> & Owned & { target: CommentTarget };
