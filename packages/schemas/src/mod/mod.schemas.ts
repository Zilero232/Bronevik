import { z } from 'zod';

import { accountIdSchema, isoDateTimeSchema } from '../common/primitives/primitives.schemas';
import { MOD_LOADOUT } from './mod.constants';

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
