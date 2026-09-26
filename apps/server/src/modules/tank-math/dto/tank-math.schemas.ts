import { tankIdSchema } from '@otmetki/schemas';
import { z } from 'zod';

const shellSchema = z.object({
  shell: z.string(),
  kind: z.string(),
  caliber: z.number().nullable(),
  isPremium: z.boolean(),
  damage: z.number(),
  speed: z.number(),
  gravity: z.number(),
  maxDistance: z.number(),
  penetration100m: z.number(),
  penetration500m: z.number()
});

const configSchema = z.object({
  modules: z.object({ chassis: z.string(), turret: z.string(), gun: z.string(), engine: z.string(), radio: z.string() }),
  handling: z.object({
    aimingTime: z.number(),
    dispersion: z.number(),
    dispersionMovement: z.number(),
    dispersionHullRotation: z.number(),
    dispersionTurretRotation: z.number(),
    dispersionAfterShot: z.number(),
    speedForward: z.number(),
    hullTraverse: z.number(),
    turretTraverse: z.number()
  }),
  shells: z.array(shellSchema),
  vision: z.object({ baseViewRange: z.number(), viewRange: z.number() }),
  camouflage: z.object({
    still: z.number(),
    moving: z.number(),
    camouflageBonus: z.number(),
    atShot: z.number(),
    camoNet: z.number()
  })
});

export const tankMathParamsSchema = z.object({ tankId: tankIdSchema });

export const tankMathSchema = z.object({
  tankId: tankIdSchema,
  isWheeled: z.boolean(),
  camoSkillRate: z.number(),
  stock: configSchema,
  top: configSchema
});
