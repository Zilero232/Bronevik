import { z } from 'zod';

import { countSchema, percentSchema, ratioSchema, tankIdSchema } from '../common/primitives/primitives.schemas';
import { loadoutSchema } from '../community/community.schemas';
import { BUILD_OPTIONS, POPULAR_BUILDS } from './builds.constants';

export const vehicleProfileIdSchema = z.enum(BUILD_OPTIONS.profiles);

export const shellStatsSchema = z.object({
  shell: z.string(),
  kind: z.string().nullable(),
  caliber: z.number().nonnegative().nullable(),
  isPremium: z.boolean(),
  damage: countSchema,
  penetration100m: z.number().nonnegative(),
  penetration500m: z.number().nonnegative(),
  speed: z.number().nonnegative(),
  explosionRadius: z.number().nonnegative().nullable(),
  damagePerMinute: z.number().nonnegative()
});

export const vehicleStatsSchema = z
  .object({
    modules: z.record(z.string(), z.string()),
    maxHealth: countSchema,
    weight: z.number().nonnegative(),
    enginePower: z.number().nonnegative(),
    powerToWeight: z.number().nonnegative(),
    speedForward: z.number().nonnegative(),
    speedBackward: z.number().nonnegative(),
    hullTraverse: z.number().nonnegative(),
    turretTraverse: z.number().nonnegative(),
    viewRange: z.number().nonnegative(),
    radioRange: z.number().nonnegative(),
    reloadTime: z.number().nonnegative(),
    rateOfFire: z.number().nonnegative(),
    aimingTime: z.number().nonnegative(),
    dispersion: z.number().nonnegative(),
    dispersionMovement: z.number().nonnegative(),
    dispersionHullRotation: z.number().nonnegative(),
    dispersionTurretRotation: z.number().nonnegative(),
    elevation: z.number().nullable(),
    depression: z.number().nullable(),
    clip: z.object({ count: countSchema, interval: z.number().nonnegative(), reloadTime: z.number().nonnegative() }).nullable(),
    shell: shellStatsSchema.nullable(),
    shells: z.array(shellStatsSchema)
  })
  .describe('Final stats of one module configuration in seconds, metres, km/h, hp and degrees per second; shell is the first (standard) shell');

export const modifierEffectSchema = z.object({
  attribute: z.string(),
  op: z.enum(['add', 'mul']),
  value: z.number(),
  specValue: z.number().nullable(),
  condition: z.string().nullable()
});

export const priceSchema = z.object({
  amount: z.number().nonnegative(),
  currency: z.string()
});

export const provisionKindSchema = z.enum(BUILD_OPTIONS.provisionKinds);

export const provisionOptionSchema = z.object({
  id: z.number().int().positive(),
  tag: z.string(),
  name: z.string(),
  kind: provisionKindSchema,
  variant: z.string().nullable(),
  group: z.string().nullable(),
  image: z.string().nullable(),
  price: priceSchema.nullable(),
  categories: z.array(z.string()),
  effects: z.array(modifierEffectSchema)
});

export const crewSkillOptionSchema = z.object({
  skill: z.string(),
  name: z.string(),
  roles: z.array(z.string()),
  isCommon: z.boolean(),
  image: z.string().nullable(),
  params: z.array(z.object({ name: z.string(), perLevel: z.number(), situational: z.boolean() }))
});

export const moduleOptionSchema = z.object({
  moduleId: z.number().int(),
  name: z.string().describe('The key to select this module in a loadout request'),
  displayName: z.string(),
  tier: z.number().int().nullable()
});

export const fieldModificationStepSchema = z.object({
  level: z.number().int().positive(),
  kind: z.enum(['modification', 'pair']),
  options: z.array(provisionOptionSchema)
});

export const buildOptionsSchema = z.object({
  tankId: tankIdSchema,
  modules: z.object({
    chassis: z.array(moduleOptionSchema),
    turrets: z.array(moduleOptionSchema.extend({ guns: z.array(moduleOptionSchema) })),
    engines: z.array(moduleOptionSchema),
    radios: z.array(moduleOptionSchema)
  }),
  crew: z.array(z.object({ role: z.string(), extraRoles: z.array(z.string()) })),
  optionalDevices: z.array(provisionOptionSchema),
  consumables: z.array(provisionOptionSchema),
  directives: z.array(provisionOptionSchema),
  fieldModifications: z.array(fieldModificationStepSchema),
  crewSkills: z.array(crewSkillOptionSchema),
  slots: z.object({ optionalDevices: countSchema, consumables: countSchema, directives: countSchema })
});

const moduleSelectionSchema = z.object({
  chassis: z.string().optional(),
  turret: z.string().optional(),
  gun: z.string().optional(),
  engine: z.string().optional(),
  radio: z.string().optional()
});

export const loadoutRequestSchema = z.object({
  loadout: loadoutSchema,
  modules: moduleSelectionSchema.optional().describe('Exact modules by name; overrides loadout.profileId'),
  specialized: z.array(z.boolean()).max(BUILD_OPTIONS.maxSpecializedSlots).default([]).describe('Per equipment slot: is it a specialization slot'),
  crewLevel: z.number().int().min(50).max(100).default(100),
  state: z
    .object({ still: z.boolean().default(false), consumablesActive: z.boolean().default(false) })
    .default({ still: false, consumablesActive: false })
});

export const loadoutResultSchema = z.object({
  tankId: tankIdSchema,
  profileId: z.string(),
  stats: vehicleStatsSchema,
  crew: z.object({ crewLevelIncrease: z.number(), levels: z.record(z.string(), z.number()) }),
  ignored: z.array(z.string()).describe('Loadout items that do not exist or do not fit this vehicle and were left out')
});

export const popularBuildsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(POPULAR_BUILDS.maxLimit).default(POPULAR_BUILDS.defaultLimit)
});

export const popularBuildSchema = z.object({
  optionalDevices: z.array(provisionOptionSchema),
  consumables: z.array(provisionOptionSchema),
  directives: z.array(provisionOptionSchema),
  battles: countSchema,
  share: ratioSchema,
  winRate: percentSchema.nullable(),
  avgDamage: z.number().nonnegative().nullable()
});

export const popularBuildsSchema = z.object({
  tankId: tankIdSchema,
  source: z.enum(POPULAR_BUILDS.sources).describe('battles: loadouts the mod reported; builds: published community builds; none: no data yet'),
  sampleSize: countSchema,
  builds: z.array(popularBuildSchema)
});
