import type { RecruitingControllerListRecruitingData, RecruitingPost } from '@/shared/api/generated';

export type { CreateRecruiting, RecruitingPage, RecruitingPost } from '@/shared/api/generated';

export type RecruitingKind = RecruitingPost['kind'];

export type RecruitingRequirements = RecruitingPost['requirements'];

export type ListRecruitingInput = NonNullable<RecruitingControllerListRecruitingData['query']> & {
  signal?: AbortSignal;
};
