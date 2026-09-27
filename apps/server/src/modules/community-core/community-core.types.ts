import type { z } from 'zod';

import type { Prisma } from '../../../generated';
import type { likeResultSchema } from './dto/community-core.schemas';

export type Viewer = { viewerUserId: string | null };
export type Owned = { userId: string };
export type ById = { id: string };

export type OwnedById = Owned & ById;
export type IdViewer = ById & Viewer;
export type LikeInput = OwnedById & { liked: boolean };
export type LikeResult = z.infer<typeof likeResultSchema>;

export type AccountOfInput = { userId: string; accountId?: number };

export type PurgeAuthoredInput = Owned & { db?: Prisma.TransactionClient };
