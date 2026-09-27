import type { Feed, SocialControllerFeedData } from '@/shared/api/generated';

export type SocialFeed = Feed;

export type SocialFeedItem = Feed['items'][number];

export type SocialFeedKind = SocialFeedItem['kind'];

export type SocialFeedInput = Required<NonNullable<SocialControllerFeedData['query']>> & {
  signal?: AbortSignal;
};
