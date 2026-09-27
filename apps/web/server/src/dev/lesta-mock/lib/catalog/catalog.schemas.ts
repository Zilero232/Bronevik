import { z } from 'zod';

export const crewSchema = z.array(z.object({ role: z.string(), extraRoles: z.array(z.string()).catch([]) })).catch([]);

export const shotsSchema = z
  .array(
    z.object({
      shellId: z.number().int().positive(),
      kind: z.string(),
      isPremium: z.boolean().catch(false),
      defaultPortion: z.number().catch(0),
      damage: z.object({ armor: z.number().positive() }).nullable().catch(null)
    })
  )
  .catch([]);

export const modulesTreeSchema = z.array(z.object({ moduleId: z.number().int() })).catch([]);
