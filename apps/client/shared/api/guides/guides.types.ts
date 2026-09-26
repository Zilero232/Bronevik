import type { Guide, GuidesControllerListData, UpdateGuide } from '../generated';

export type { CreateGuide, Guide, GuideAuthors, GuideList, GuidePage, LikeResult, UpdateGuide } from '../generated';

export type GuideKind = Guide['kind'];

export type GuideStatus = Guide['status'];

export type GuideAuthor = Guide['author'];

export type GuideListQuery = NonNullable<GuidesControllerListData['query']>;

export type GuideSort = NonNullable<GuideListQuery['sort']>;

export type GuideListInput = GuideListQuery & {
  signal?: AbortSignal;
};

export type GuideBySlugInput = {
  slug: string;
  signal?: AbortSignal;
};

export type UpdateGuideInput = {
  id: string;
  body: UpdateGuide;
};
