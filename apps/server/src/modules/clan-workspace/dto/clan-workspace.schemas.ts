import { accountIdSchema, clanIdSchema, countSchema, isoDateTimeSchema, uuidSchema } from '@bronevik/schemas';
import { z } from 'zod';

export const clanParamsSchema = z.object({ clanId: clanIdSchema });

export const clanEventParamsSchema = z.object({ clanId: clanIdSchema, id: uuidSchema });

const clanEventKindSchema = z.enum(['clan_wars', 'stronghold', 'training', 'tournament', 'other']);

const attendanceStatusSchema = z.enum(['invited', 'confirmed', 'declined', 'attended', 'absent']);

const recruitStatusSchema = z.enum(['sourced', 'contacted', 'trial', 'accepted', 'rejected']);

export const candidateStatsSchema = z.object({
  nickname: z.string().nullable(),
  battles: countSchema.nullable(),
  wn8: z.number().nullable(),
  winRate: z.number().nullable(),
  avgDamage: z.number().nullable(),
  capturedAt: isoDateTimeSchema
});

export const clanEventSchema = z.object({
  id: uuidSchema,
  kind: clanEventKindSchema,
  title: z.string(),
  startsAt: isoDateTimeSchema,
  endsAt: isoDateTimeSchema.nullable(),
  remindAt: isoDateTimeSchema.nullable(),
  remindedAt: isoDateTimeSchema.nullable(),
  attendance: z.array(
    z.object({ accountId: accountIdSchema, nickname: z.string().nullable(), status: attendanceStatusSchema, source: z.enum(['manual', 'api']) })
  )
});

export const clanEventListSchema = z.array(clanEventSchema);

export const clanEventsQuerySchema = z.object({
  from: isoDateTimeSchema.optional(),
  to: isoDateTimeSchema.optional()
});

export const createClanEventSchema = z.object({
  kind: clanEventKindSchema,
  title: z.string().trim().min(2).max(120),
  startsAt: isoDateTimeSchema,
  endsAt: isoDateTimeSchema.optional(),
  remindMinutesBefore: z
    .number()
    .int()
    .min(0)
    .max(7 * 24 * 60)
    .optional()
});

export const updateClanEventSchema = createClanEventSchema.partial();

export const setAttendanceSchema = z.object({
  entries: z
    .array(z.object({ accountId: accountIdSchema, status: attendanceStatusSchema }))
    .min(1)
    .max(100)
});

export const rsvpSchema = z.object({ status: z.enum(['confirmed', 'declined']) });

export const candidateSchema = z.object({
  id: uuidSchema,
  accountId: accountIdSchema,
  status: recruitStatusSchema,
  notes: z.string().nullable(),
  stats: candidateStatsSchema.nullable(),
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema
});

export const candidateListSchema = z.array(candidateSchema);

export const candidatesQuerySchema = z.object({ status: recruitStatusSchema.optional() });

export const createCandidateSchema = z.object({
  accountId: accountIdSchema,
  notes: z.string().trim().max(4000).optional()
});

export const updateCandidateSchema = z.object({
  status: recruitStatusSchema.optional(),
  notes: z.string().trim().max(4000).nullable().optional(),
  refreshStats: z.boolean().default(false)
});

export const weeklyReportSchema = z.object({
  clanId: clanIdSchema,
  from: isoDateTimeSchema,
  to: isoDateTimeSchema,
  events: countSchema,
  attendanceRate: z.number().min(0).max(1).nullable(),
  newCandidates: countSchema,
  inactiveMembers: countSchema
});

export const workspaceSchema = z.object({
  clanId: clanIdSchema,
  clanTag: z.string(),
  clanName: z.string(),
  role: z.enum(['officer', 'member']),
  membersCount: countSchema,
  upcoming: clanEventListSchema,
  candidates: z.record(recruitStatusSchema, countSchema),
  createdAt: isoDateTimeSchema
});
