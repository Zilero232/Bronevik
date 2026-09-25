import { z } from 'zod';

const text = z.string().nullish();
const count = z.number().nullish();
const ids = z.array(z.number()).nullish();

export const moduleSchema = z.looseObject({
  module_id: z.number(),
  name: z.string(),
  type: z.string(),
  nation: z.string(),
  tier: z.number(),
  price_credit: count,
  weight: count,
  image: text,
  tanks: ids
});

export const provisionSchema = z.looseObject({
  provision_id: z.number(),
  name: z.string(),
  tag: text,
  type: z.string(),
  description: text,
  image: text,
  price_credit: count,
  price_gold: count,
  weight: count,
  tanks: ids
});

export const crewSkillSchema = z.looseObject({
  skill: z.string(),
  name: z.string(),
  type: text,
  roles: z.array(z.string()).nullish(),
  is_common: z.boolean().nullish(),
  description: text,
  image_url: z.record(z.string(), z.string().nullish()).nullish()
});

export const crewRoleSchema = z.looseObject({
  name: z.string(),
  skills: z.array(z.string()).nullish()
});

export const arenaSchema = z.looseObject({
  name_i18n: text,
  name: text,
  camouflage_type: text,
  description: text,
  image: text
});

export const achievementSchema = z.looseObject({
  name: z.string(),
  name_i18n: text,
  section: text,
  type: text,
  description: text,
  condition: text,
  image: text,
  image_big: text,
  options: z.unknown().optional(),
  order: count
});
