import type { z } from 'zod';

import type { accountIdSchema, clanIdSchema, clanTagSchema, nicknameSchema, tankIdSchema } from './primitives.schemas';

export type AccountId = z.infer<typeof accountIdSchema>;
export type ClanId = z.infer<typeof clanIdSchema>;
export type TankId = z.infer<typeof tankIdSchema>;
export type Nickname = z.infer<typeof nicknameSchema>;
export type ClanTag = z.infer<typeof clanTagSchema>;
