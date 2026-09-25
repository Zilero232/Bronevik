import { createZodDto } from 'nestjs-zod';

import {
  challengeSchema,
  challengesSchema,
  createFollowSchema,
  feedItemSchema,
  feedQuerySchema,
  feedSchema,
  followListSchema,
  followParamsSchema,
  followSchema,
  leagueQuerySchema,
  leagueSchema,
  signatureParamsSchema,
  wrappedParamsSchema,
  wrappedQuerySchema,
  wrappedSchema
} from './social.schemas';

export class FollowDto extends createZodDto(followSchema) {}
export class FollowListDto extends createZodDto(followListSchema) {}
export class CreateFollowDto extends createZodDto(createFollowSchema) {}
export class FollowParamsDto extends createZodDto(followParamsSchema) {}
export class FeedItemDto extends createZodDto(feedItemSchema) {}
export class FeedDto extends createZodDto(feedSchema) {}
export class FeedQueryDto extends createZodDto(feedQuerySchema) {}
export class LeagueQueryDto extends createZodDto(leagueQuerySchema) {}
export class LeagueDto extends createZodDto(leagueSchema) {}
export class ChallengeDto extends createZodDto(challengeSchema) {}
export class ChallengesDto extends createZodDto(challengesSchema) {}
export class SignatureParamsDto extends createZodDto(signatureParamsSchema) {}
export class WrappedParamsDto extends createZodDto(wrappedParamsSchema) {}
export class WrappedQueryDto extends createZodDto(wrappedQuerySchema) {}
export class WrappedDto extends createZodDto(wrappedSchema) {}
