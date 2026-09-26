import type { z } from 'zod';

import type { createFollowSchema, followKindSchema, followListSchema, followSchema } from './follows.schemas';

export type FollowKind = z.infer<typeof followKindSchema>;
export type Follow = z.infer<typeof followSchema>;
export type FollowList = z.infer<typeof followListSchema>;
export type CreateFollowInput = z.infer<typeof createFollowSchema>;
