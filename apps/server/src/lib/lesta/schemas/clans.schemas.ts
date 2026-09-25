import { z } from 'zod';

export const clanMemberSchema = z.looseObject({
  account_id: z.number(),
  account_name: z.string(),
  joined_at: z.number(),
  role: z.string(),
  role_i18n: z.string().optional()
});

export const clanInfoSchema = z.looseObject({
  clan_id: z.number(),
  name: z.string(),
  tag: z.string(),
  color: z.string().nullish(),
  motto: z.string().nullish(),
  description: z.string().nullish(),
  description_html: z.string().nullish(),
  created_at: z.number(),
  updated_at: z.number().optional(),
  creator_id: z.number().nullish(),
  creator_name: z.string().nullish(),
  leader_id: z.number().nullish(),
  leader_name: z.string().nullish(),
  members_count: z.number(),
  is_clan_disbanded: z.boolean().optional(),
  old_name: z.string().nullish(),
  old_tag: z.string().nullish(),
  renamed_at: z.number().nullish(),
  accepts_join_requests: z.boolean().optional(),
  emblems: z.record(z.string(), z.unknown()).nullish(),
  members: z.array(clanMemberSchema).nullish(),
  private: z.record(z.string(), z.unknown()).nullish()
});

export const clanMemberHistoryEntrySchema = z.looseObject({
  clan_id: z.number(),
  joined_at: z.number(),
  left_at: z.number().nullish(),
  role: z.string().nullish()
});

export const clanListItemSchema = z.looseObject({
  clan_id: z.number(),
  name: z.string(),
  tag: z.string(),
  members_count: z.number(),
  created_at: z.number(),
  color: z.string().nullish(),
  emblems: z.record(z.string(), z.unknown()).nullish()
});

export const clanAccountInfoSchema = z.looseObject({
  account_id: z.number(),
  account_name: z.string(),
  clan_id: z.number().nullable(),
  joined_at: z.number().nullish(),
  role: z.string().nullish(),
  role_i18n: z.string().nullish(),
  clan: z.looseObject({}).nullish()
});
