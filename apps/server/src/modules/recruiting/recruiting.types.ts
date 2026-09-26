import type { z } from 'zod';

import type { RecruitingPost, RecruitingPostKind } from '../../../generated';
import type { Owned } from '../community-core';
import type { createRecruitingSchema, recruitingPageSchema, recruitingPostSchema, recruitingQuerySchema } from './dto/recruiting.schemas';

export type RecruitingView = z.infer<typeof recruitingPostSchema>;
export type RecruitingQuery = Omit<z.output<typeof recruitingQuerySchema>, 'kind'> & { kind: RecruitingPostKind | undefined };
export type RecruitingPage = z.infer<typeof recruitingPageSchema>;
export type CreateRecruitingRequest = Omit<z.output<typeof createRecruitingSchema>, 'kind'> & Owned & { kind: RecruitingPostKind };

export type CanCloseInput = {
  post: Pick<RecruitingPost, 'accountId' | 'authorUserId' | 'clanId'>;
  userId: string;
};
