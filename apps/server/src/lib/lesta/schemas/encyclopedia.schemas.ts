import { z } from 'zod';

const looseRecord = z.looseObject({});

const vehicleImagesSchema = z.looseObject({
  small_icon: z.string().nullish(),
  contour_icon: z.string().nullish(),
  big_icon: z.string().nullish()
});

export const vehicleProfileSchema = z.looseObject({
  tank_id: z.number().optional(),
  profile_id: z.string().optional(),
  is_default: z.boolean().optional(),
  hp: z.number().optional(),
  hull_hp: z.number().optional(),
  hull_weight: z.number().optional(),
  weight: z.number().optional(),
  max_weight: z.number().optional(),
  speed_forward: z.number().optional(),
  speed_backward: z.number().optional(),
  max_ammo: z.number().optional(),
  armor: looseRecord.nullish(),
  gun: looseRecord.nullish(),
  engine: looseRecord.nullish(),
  suspension: looseRecord.nullish(),
  turret: looseRecord.nullish(),
  radio: looseRecord.nullish(),
  ammo: z.array(looseRecord).nullish(),
  modules: looseRecord.nullish(),
  siege: z.unknown().optional(),
  rapid: z.unknown().optional()
});

export const vehicleSchema = z.looseObject({
  tank_id: z.number(),
  name: z.string(),
  short_name: z.string().nullish(),
  tier: z.number(),
  type: z.string(),
  nation: z.string(),
  tag: z.string().nullish(),
  is_premium: z.boolean(),
  is_gift: z.boolean().optional(),
  is_premium_igr: z.boolean().optional(),
  is_wheeled: z.boolean().optional(),
  description: z.string().nullish(),
  price_credit: z.number().nullish(),
  price_gold: z.number().nullish(),
  images: vehicleImagesSchema.nullish(),
  default_profile: vehicleProfileSchema.nullish(),
  crew: z.array(looseRecord).nullish(),
  modules_tree: z.record(z.string(), looseRecord).nullish(),
  guns: z.array(z.number()).nullish(),
  engines: z.array(z.number()).nullish(),
  radios: z.array(z.number()).nullish(),
  suspensions: z.array(z.number()).nullish(),
  turrets: z.array(z.number()).nullish(),
  next_tanks: z.record(z.string(), z.number()).nullish(),
  prices_xp: z.record(z.string(), z.number()).nullish(),
  provisions: z.array(z.number()).nullish()
});

export const encyclopediaInfoSchema = z.looseObject({
  game_version: z.string(),
  tanks_updated_at: z.number(),
  languages: z.record(z.string(), z.string()).optional(),
  vehicle_types: z.record(z.string(), z.string()).optional(),
  vehicle_nations: z.record(z.string(), z.string()).optional(),
  vehicle_crew_roles: z.record(z.string(), z.string()).optional(),
  achievement_sections: z.record(z.string(), looseRecord).optional()
});
