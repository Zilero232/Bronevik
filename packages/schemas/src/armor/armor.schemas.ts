import { z } from 'zod';

import { vehicleSummarySchema } from '../vehicles/vehicles.schemas';

export const armorPlateSchema = z.object({
  name: z.string(),
  thickness: z.number().nonnegative(),
  flags: z.number().int().nonnegative()
});

export const armorShellOptionSchema = z.object({
  name: z.string(),
  displayName: z.string(),
  kind: z.string(),
  caliber: z.number().nonnegative(),
  damage: z.number().nonnegative(),
  penetration: z.object({ at100m: z.number().nonnegative(), at500m: z.number().nonnegative() }),
  isPremium: z.boolean()
});

export const armorPieceArmorSchema = z.object({
  piece: z.string(),
  plates: z.array(armorPlateSchema)
});

export const armorGunModuleSchema = armorPieceArmorSchema.extend({
  name: z.string(),
  displayName: z.string(),
  shells: z.array(armorShellOptionSchema)
});

export const armorTurretModuleSchema = armorPieceArmorSchema.extend({
  name: z.string(),
  displayName: z.string(),
  guns: z.array(armorGunModuleSchema)
});

export const armorChassisModuleSchema = armorPieceArmorSchema.extend({
  name: z.string(),
  displayName: z.string()
});

export const armorModulesSchema = z.object({
  hull: armorPieceArmorSchema,
  chassis: z.array(armorChassisModuleSchema),
  turrets: z.array(armorTurretModuleSchema)
});

export const armorModelSourceSchema = z.object({
  repo: z.string(),
  commit: z.string()
});

export const armorModelSchema = z.object({
  vehicle: vehicleSummarySchema,
  gameVersion: z.string(),
  hash: z.string(),
  geometry: z.base64(),
  modules: armorModulesSchema,
  source: armorModelSourceSchema
});
