import {
  accountIdSchema,
  buildSchema,
  clanIdSchema,
  countSchema,
  createBuildSchema,
  isoDateTimeSchema,
  paginatedSchema,
  paginationQuerySchema,
  tankIdSchema,
  uuidSchema,
  visibilitySchema
} from '@bronevik/schemas';
import { z } from 'zod';

import { COACHING, COMMENTS, GUIDES, PLATOON, RECRUITING, TOURNAMENT } from '../config';
import { statRequirementsSchema } from '../lib/requirements';

const arenaIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(64)
  .regex(/^[\w-]+$/);

const authorSchema = z.object({ id: uuidSchema, name: z.string(), image: z.url().nullable() });

const playerStatsSchema = z.object({
  battles: countSchema,
  wn8: z.number().nullable(),
  winRate: z.number().min(0).max(1).nullable()
});

export const idParamsSchema = z.object({ id: uuidSchema });

export const tankParamsSchema = z.object({ id: tankIdSchema });

export const slugParamsSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .regex(/^[\w-]+$/)
});

export const moderationStatusSchema = z.enum(['draft', 'pending', 'published', 'rejected', 'hidden']);

export const likeResultSchema = z.object({ liked: z.boolean(), likesCount: countSchema });

export const buildsQuerySchema = paginationQuerySchema.extend({
  tankId: tankIdSchema.optional(),
  sort: z.enum(['popular', 'recent']).default('popular')
});

export const buildPageSchema = paginatedSchema(buildSchema);

export const buildListSchema = z.array(buildSchema);

export const updateBuildSchema = createBuildSchema.omit({ tankId: true }).partial();

export const guideKindSchema = z.enum(['tank', 'map', 'general']);

export const guideSchema = z.object({
  id: uuidSchema,
  slug: z.string(),
  kind: guideKindSchema,
  tankId: tankIdSchema.nullable(),
  arenaId: z.string().nullable(),
  locale: z.string(),
  title: z.string(),
  body: z.string(),
  status: moderationStatusSchema,
  likesCount: countSchema,
  likedByMe: z.boolean(),
  author: authorSchema,
  publishedAt: isoDateTimeSchema.nullable(),
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema
});

export const guidesQuerySchema = paginationQuerySchema.extend({
  kind: guideKindSchema.optional(),
  tankId: tankIdSchema.optional(),
  arenaId: arenaIdSchema.optional(),
  sort: z.enum(['popular', 'recent']).default('recent')
});

export const guidePageSchema = paginatedSchema(guideSchema);

export const guideListSchema = z.array(guideSchema);

export const createGuideSchema = z.object({
  kind: guideKindSchema,
  tankId: tankIdSchema.optional(),
  arenaId: arenaIdSchema.optional(),
  locale: z.enum(['ru', 'en']).default('ru'),
  title: z.string().trim().min(5).max(140),
  body: z.string().trim().min(50).max(GUIDES.maxBodyLength)
});

export const updateGuideSchema = createGuideSchema.partial();

export const guideAuthorSchema = z.object({ author: authorSchema, guides: countSchema, likes: countSchema });

export const guideAuthorsSchema = z.array(guideAuthorSchema);

export const commentTargetSchema = z.enum(['build', 'guide', 'replay', 'tactic_board']);

export const commentSchema = z.object({
  id: uuidSchema,
  target: commentTargetSchema,
  targetId: z.string(),
  parentId: uuidSchema.nullable(),
  body: z.string(),
  author: authorSchema,
  createdAt: isoDateTimeSchema
});

export const commentsQuerySchema = z.object({
  target: commentTargetSchema,
  targetId: z.string().trim().min(1).max(64)
});

export const commentListSchema = z.array(commentSchema);

export const createCommentSchema = commentsQuerySchema.extend({
  parentId: uuidSchema.optional(),
  body: z.string().trim().min(1).max(COMMENTS.maxBodyLength)
});

export const postStatusSchema = z.enum(['open', 'closed', 'expired', 'hidden']);

export const platoonPostSchema = z.object({
  id: uuidSchema,
  accountId: accountIdSchema,
  nickname: z.string().nullable(),
  tiers: z.array(z.number().int().min(1).max(11)),
  modes: z.array(z.string()),
  tankIds: z.array(tankIdSchema),
  hasVoice: z.boolean(),
  minWn8: z.number().int().nullable(),
  message: z.string().nullable(),
  status: postStatusSchema,
  stats: playerStatsSchema.nullable(),
  availableFrom: isoDateTimeSchema.nullable(),
  availableUntil: isoDateTimeSchema.nullable(),
  expiresAt: isoDateTimeSchema,
  createdAt: isoDateTimeSchema
});

export const platoonQuerySchema = paginationQuerySchema.extend({
  tier: z.coerce.number().int().min(1).max(11).optional(),
  mode: z.string().trim().min(1).max(32).optional(),
  hasVoice: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true')
    .optional(),
  minWn8: z.coerce.number().int().min(0).optional(),
  maxWn8: z.coerce.number().int().min(0).optional(),
  availableAt: isoDateTimeSchema.optional()
});

export const platoonPageSchema = paginatedSchema(platoonPostSchema);

export const createPlatoonSchema = z.object({
  accountId: accountIdSchema.optional(),
  tiers: z.array(z.number().int().min(1).max(11)).max(11).default([]),
  modes: z.array(z.string().trim().min(1).max(32)).max(10).default([]),
  tankIds: z.array(tankIdSchema).max(20).default([]),
  hasVoice: z.boolean().default(false),
  minWn8: z.number().int().min(0).max(10_000).optional(),
  message: z.string().trim().max(500).optional(),
  availableFrom: isoDateTimeSchema.optional(),
  availableUntil: isoDateTimeSchema.optional(),
  expiresInHours: z.number().int().min(1).max(PLATOON.maxHours).default(PLATOON.defaultHours)
});

export const recruitingKindSchema = z.enum(['clan_seeks_player', 'player_seeks_clan']);

export const recruitingPostSchema = z.object({
  id: uuidSchema,
  kind: recruitingKindSchema,
  clanId: clanIdSchema.nullable(),
  clanTag: z.string().nullable(),
  accountId: accountIdSchema.nullable(),
  nickname: z.string().nullable(),
  title: z.string(),
  body: z.string(),
  requirements: statRequirementsSchema,
  stats: playerStatsSchema.nullable(),
  status: postStatusSchema,
  expiresAt: isoDateTimeSchema.nullable(),
  createdAt: isoDateTimeSchema
});

export const recruitingQuerySchema = paginationQuerySchema.extend({
  kind: recruitingKindSchema.optional(),
  clanId: clanIdSchema.optional()
});

export const recruitingPageSchema = paginatedSchema(recruitingPostSchema);

export const createRecruitingSchema = z.object({
  kind: recruitingKindSchema,
  clanId: clanIdSchema.optional(),
  accountId: accountIdSchema.optional(),
  title: z.string().trim().min(5).max(140),
  body: z.string().trim().min(10).max(4000),
  requirements: statRequirementsSchema.default({}),
  expiresInDays: z.number().int().min(1).max(RECRUITING.maxDays).default(RECRUITING.defaultDays)
});

const priceSchema = z.number().min(COACHING.minPriceRub).max(COACHING.maxPriceRub);

export const coachOfferSchema = z.object({
  id: uuidSchema,
  title: z.string(),
  description: z.string().nullable(),
  priceRub: z.number(),
  durationMinutes: z.number().int().positive(),
  withReplay: z.boolean(),
  isActive: z.boolean()
});

export const coachSchema = z.object({
  userId: uuidSchema,
  name: z.string(),
  image: z.url().nullable(),
  accountId: accountIdSchema,
  headline: z.string(),
  bio: z.string().nullable(),
  priceRub: z.number(),
  tankIds: z.array(tankIdSchema),
  isActive: z.boolean(),
  rating: z.number().nullable(),
  ordersDone: countSchema,
  stats: playerStatsSchema.nullable(),
  offers: z.array(coachOfferSchema)
});

export const coachesQuerySchema = paginationQuerySchema.extend({
  tankId: tankIdSchema.optional()
});

export const coachPageSchema = paginatedSchema(coachSchema);

export const upsertCoachSchema = z.object({
  accountId: accountIdSchema,
  headline: z.string().trim().min(5).max(140),
  bio: z.string().trim().max(4000).optional(),
  priceRub: priceSchema,
  tankIds: z.array(tankIdSchema).max(30).default([]),
  isActive: z.boolean().default(true)
});

export const createOfferSchema = z.object({
  title: z.string().trim().min(3).max(140),
  description: z.string().trim().max(2000).optional(),
  priceRub: priceSchema,
  durationMinutes: z.number().int().min(15).max(600),
  withReplay: z.boolean().default(false)
});

export const updateOfferSchema = createOfferSchema.partial().extend({ isActive: z.boolean().optional() });

export const coachingOrderStatusSchema = z.enum(['requested', 'accepted', 'paid', 'completed', 'cancelled', 'disputed']);

export const coachingOrderSchema = z.object({
  id: uuidSchema,
  coachUserId: uuidSchema,
  studentUserId: uuidSchema,
  offerId: uuidSchema.nullable(),
  replayId: uuidSchema.nullable(),
  status: coachingOrderStatusSchema,
  priceRub: z.number(),
  notes: z.string().nullable(),
  review: z.string().nullable(),
  score: z.number().int().min(1).max(5).nullable(),
  createdAt: isoDateTimeSchema,
  completedAt: isoDateTimeSchema.nullable()
});

export const coachingOrderListSchema = z.array(coachingOrderSchema);

export const createOrderSchema = z.object({
  coachUserId: uuidSchema,
  offerId: uuidSchema.optional(),
  replayId: uuidSchema.optional(),
  notes: z.string().trim().max(2000).optional()
});

export const reviewOrderSchema = z.object({
  score: z.number().int().min(1).max(5),
  review: z.string().trim().max(2000).optional()
});

export const checkoutSchema = z.object({ confirmationUrl: z.url(), paymentId: z.string() });

export const tournamentStatusSchema = z.enum(['draft', 'registration', 'running', 'finished', 'cancelled']);

export const bracketSchema = z.object({
  size: z.number().int().positive(),
  rounds: z.array(
    z.array(
      z.object({
        round: z.number().int().nonnegative(),
        index: z.number().int().nonnegative(),
        a: z.number().int().nullable(),
        b: z.number().int().nullable(),
        winner: z.number().int().nullable()
      })
    )
  )
});

export const tournamentParticipantSchema = z.object({
  accountId: accountIdSchema,
  nickname: z.string().nullable(),
  teamName: z.string().nullable(),
  seed: z.number().int().nullable(),
  verified: z.boolean()
});

export const tournamentSchema = z.object({
  id: uuidSchema,
  slug: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  requirements: statRequirementsSchema,
  maxParticipants: z.number().int().positive(),
  bracket: bracketSchema.nullable(),
  status: tournamentStatusSchema,
  organizerUserId: uuidSchema,
  registrationEndsAt: isoDateTimeSchema.nullable(),
  startsAt: isoDateTimeSchema,
  participants: z.array(tournamentParticipantSchema)
});

export const tournamentsQuerySchema = paginationQuerySchema.extend({
  status: tournamentStatusSchema.optional()
});

export const tournamentPageSchema = paginatedSchema(tournamentSchema);

export const createTournamentSchema = z.object({
  title: z.string().trim().min(5).max(140),
  description: z.string().trim().max(8000).optional(),
  requirements: statRequirementsSchema.default({}),
  maxParticipants: z.number().int().min(TOURNAMENT.minParticipants).max(TOURNAMENT.maxParticipants).default(64),
  registrationEndsAt: isoDateTimeSchema.optional(),
  startsAt: isoDateTimeSchema
});

export const registerTournamentSchema = z.object({
  accountId: accountIdSchema.optional(),
  teamName: z.string().trim().min(2).max(40).optional()
});

export const reportMatchSchema = z.object({
  round: z.number().int().nonnegative(),
  index: z.number().int().nonnegative(),
  winner: accountIdSchema
});

export const reportTargetSchema = z.enum([
  'build',
  'guide',
  'comment',
  'replay',
  'platoon_post',
  'recruiting_post',
  'coach',
  'tournament',
  'tactic_board'
]);

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

export const tacticLayerSchema = z.object({
  id: z.string().min(1).max(64),
  name: z.string().max(64),
  visible: z.boolean().default(true),
  strokes: z
    .array(
      z.object({
        id: z.string().min(1).max(64),
        tool: z.enum(['pen', 'arrow', 'line', 'circle', 'rect', 'text']),
        color: z.string().max(32),
        width: z.number().positive().max(64),
        points: z.array(z.number()).max(4000),
        text: z.string().max(500).optional()
      })
    )
    .max(2000)
    .default([]),
  icons: z
    .array(
      z.object({
        id: z.string().min(1).max(64),
        kind: z.enum(['lightTank', 'mediumTank', 'heavyTank', 'AT-SPG', 'SPG', 'flag', 'marker']),
        team: z.number().int().min(0).max(2),
        x: z.number(),
        y: z.number(),
        rotation: z.number().default(0),
        label: z.string().max(64).optional()
      })
    )
    .max(500)
    .default([])
});

export const tacticBoardDataSchema = z.object({
  layers: z.array(tacticLayerSchema).max(20).default([])
});

export const tacticBoardSchema = z.object({
  id: uuidSchema,
  title: z.string(),
  arenaId: z.string().nullable(),
  mode: z.string().nullable(),
  visibility: visibilitySchema,
  data: tacticBoardDataSchema,
  role: z.enum(['owner', 'edit', 'view']),
  shareToken: z.string().nullable(),
  editToken: z.string().nullable(),
  updatedAt: isoDateTimeSchema
});

export const tacticBoardListSchema = z.array(tacticBoardSchema);

export const createTacticBoardSchema = z.object({
  title: z.string().trim().min(1).max(120),
  arenaId: arenaIdSchema.optional(),
  mode: z.string().trim().min(1).max(32).optional(),
  visibility: visibilitySchema.default('unlisted'),
  data: tacticBoardDataSchema.default({ layers: [] })
});

export const updateTacticBoardSchema = createTacticBoardSchema.partial();

export const boardTokenQuerySchema = z.object({ token: z.string().trim().min(8).max(64).optional() });
