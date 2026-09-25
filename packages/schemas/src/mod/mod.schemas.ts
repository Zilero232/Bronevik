import { z } from 'zod';

import { accountIdSchema, isoDateTimeSchema } from '../common/primitives/primitives.schemas';

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
