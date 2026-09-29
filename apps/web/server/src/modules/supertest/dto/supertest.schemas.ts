import { accountIdSchema, countSchema, isoDateTimeSchema, tankIdSchema, uuidSchema, vehicleSummarySchema } from '@otmetki/schemas';
import { z } from 'zod';

const supertestVerdictSchema = z
  .enum(['buff', 'nerf', 'neutral'])
  .describe(
    'buff: better than before for the player (lower is better for reload, aim time, dispersion and weight); nerf: worse; neutral: unchanged or unknown'
  );

export const supertestChangeSchema = z.object({
  id: uuidSchema,
  param: z
    .string()
    .nullable()
    .describe(
      'Normalised characteristic key (reloadTime, aimingTime, dispersion, shellDamage, shellPenetration, maxHealth, viewRange, …); null when the line names no known one'
    ),
  label: z.string().describe('The characteristic as the announcement names it'),
  from: z.number().nullable().describe('Value before the change as announced; null for a new vehicle or when only the new value is given'),
  to: z.number().nullable().describe('Value on the supertest; null for a worded change without numbers'),
  live: z.number().nullable().describe('Value of the top configuration in the current game data at the time the announcement was parsed'),
  delta: z.number().nullable().describe('to minus from, or minus live when the announcement gives only the new value'),
  unit: z.string().nullable(),
  raw: z.string().describe('The source line'),
  verdict: supertestVerdictSchema
});

export const supertestTankSchema = z.object({
  key: z.string(),
  tankId: tankIdSchema.nullable(),
  name: z.string(),
  vehicle: vehicleSummarySchema.nullable(),
  isNewVehicle: z.boolean(),
  verdict: supertestVerdictSchema.describe('buff when buffs outnumber nerfs, nerf when the reverse, neutral otherwise'),
  changes: z.array(supertestChangeSchema)
});

export const supertestAnnouncementSchema = z.object({
  id: uuidSchema,
  url: z.url(),
  title: z.string(),
  summary: z.string().nullable(),
  image: z.string().nullable(),
  source: z.string(),
  isOfficial: z.boolean().describe('True for tanki.su announcements; false for development data'),
  publishedAt: isoDateTimeSchema,
  parsedAt: isoDateTimeSchema.nullable(),
  tanks: z.array(supertestTankSchema)
});

const supertestTotalsSchema = z.object({
  announcements: countSchema,
  tanks: countSchema,
  buffs: countSchema,
  nerfs: countSchema
});

export const supertestListSchema = z.object({
  announcements: z.array(supertestAnnouncementSchema),
  totals: supertestTotalsSchema,
  updatedAt: isoDateTimeSchema.nullable()
});

export const supertestMineSchema = z.object({
  accountId: accountIdSchema,
  announcements: z.array(supertestAnnouncementSchema).describe('Announcements narrowed to the tanks the account has played'),
  totals: supertestTotalsSchema
});

export const supertestParamsSchema = z.object({
  id: uuidSchema
});
