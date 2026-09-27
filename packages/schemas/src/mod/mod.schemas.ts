import { z } from 'zod';

import { accountIdSchema, countSchema, isoDateTimeSchema, percentSchema } from '../common/primitives/primitives.schemas';
import { ratingValueSchema } from '../common/rating/rating.schemas';
import { sessionKindSchema, sessionSourceSchema } from '../sessions/sessions.schemas';
import { MOD_ERROR_CODES, MOD_LOADOUT, MOD_RATINGS } from './mod.constants';

export const bindCodeInputSchema = z.object({
  accountId: accountIdSchema.optional()
});

export const bindCodeSchema = z.object({
  code: z.string(),
  accountId: z.number().int().positive().nullable(),
  expiresAt: isoDateTimeSchema
});

export const modDeviceSchema = z.object({
  id: z.string(),
  accountId: z.number().int().positive().nullable(),
  name: z.string().nullable(),
  modVersion: z.string().nullable(),
  gameVersion: z.string().nullable(),
  lastSeenAt: isoDateTimeSchema.nullable(),
  revokedAt: isoDateTimeSchema.nullable(),
  createdAt: isoDateTimeSchema
});

export const modDevicesSchema = z.array(modDeviceSchema);

const itemId = z.number().int().min(1);
const gameTag = z
  .string()
  .min(1)
  .max(64)
  .regex(/^[\w.-]+$/);

export const modBattleLoadoutSchema = z
  .strictObject({
    optional_devices: z.array(itemId.nullable()).max(MOD_LOADOUT.optionalDevices),
    consumables: z.array(itemId.nullable()).max(MOD_LOADOUT.consumables),
    directives: z.array(itemId.nullable()).max(MOD_LOADOUT.directives),
    shells: z.array(z.strictObject({ shell_id: itemId, count: z.number().int().min(0).max(MOD_LOADOUT.shellCount) })).max(MOD_LOADOUT.shells),
    field_modifications: z.array(gameTag).max(MOD_LOADOUT.fieldModifications),
    crew: z.array(z.strictObject({ role: gameTag, skills: z.array(gameTag).max(MOD_LOADOUT.skillsPerMember) })).max(MOD_LOADOUT.crewMembers),
    gameplay_id: z.number().int().min(0).max(MOD_LOADOUT.gameplayId).nullable()
  })
  .describe(
    'The own vehicle loadout of one battle: item compact descriptors per slot, loaded shells, field modification names and crew skills in learning order'
  );

export const modErrorCodeSchema = z.enum(MOD_ERROR_CODES);

export const modDeviceIdSchema = z.string().min(1).max(MOD_RATINGS.deviceIdMaxLength).regex(MOD_RATINGS.deviceIdPattern);

const modAccountIdSchema = z.number().int().positive();
const modTankIdSchema = z.number().int().positive();
const averageSchema = z.number().nonnegative().nullable();

export const modRatingsRequestSchema = z
  .strictObject({
    device_id: modDeviceIdSchema,
    account_id: modAccountIdSchema
  })
  .describe('Signed body of POST /mod/me/overview: the bound device and its account, nothing else');

export const modTankRatingsRequestSchema = z
  .strictObject({
    device_id: modDeviceIdSchema,
    account_id: modAccountIdSchema,
    tank_ids: z.array(modTankIdSchema).min(1).max(MOD_RATINGS.maxTanks)
  })
  .describe('Signed body of POST /mod/me/tanks: the own vehicles to rate (Lesta tank_id, the client intCD)');

export const modOverallRatingsSchema = z.object({
  battles: countSchema,
  win_rate: percentSchema.nullable(),
  avg_damage: averageSchema,
  wn8: ratingValueSchema,
  eff: ratingValueSchema,
  brone_index: ratingValueSchema,
  updated_at: isoDateTimeSchema
});

export const modSessionRatingsSchema = z.object({
  kind: sessionKindSchema,
  source: sessionSourceSchema,
  is_live: z.boolean(),
  started_at: isoDateTimeSchema,
  ended_at: isoDateTimeSchema.nullable(),
  battles: countSchema,
  win_rate: percentSchema.nullable(),
  avg_damage: averageSchema,
  wn8: ratingValueSchema,
  brone_index: ratingValueSchema
});

export const modOverviewSchema = z
  .object({
    account_id: modAccountIdSchema,
    nickname: z.string().nullable(),
    overall: modOverallRatingsSchema.nullable().describe('Random-battle ratings over the whole career; null until the account is tracked'),
    session: modSessionRatingsSchema.nullable().describe('The latest play session: the mod live session, else the latest API day')
  })
  .describe('The bound account own ratings, as the mod hangar panel shows them');

export const modTankRatingSchema = z.object({
  tank_id: modTankIdSchema,
  battles: countSchema,
  win_rate: percentSchema.nullable(),
  avg_damage: averageSchema,
  wn8: ratingValueSchema,
  moe_percent: percentSchema.nullable(),
  marks_on_gun: z.number().int().min(0).max(3).nullable(),
  mastery: z.number().int().min(0).max(4)
});

export const modTankRatingsSchema = z
  .object({
    account_id: modAccountIdSchema,
    tanks: z.array(modTankRatingSchema).describe('One row per requested tank the account has data for, in request order')
  })
  .describe('Per-tank own ratings of the bound account');
