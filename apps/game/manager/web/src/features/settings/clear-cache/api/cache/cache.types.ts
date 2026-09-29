import type { z } from 'zod';

import type { cachePlanSchema, cacheResultSchema, cacheTargetSchema } from './cache.schemas';

export type CacheTarget = z.infer<typeof cacheTargetSchema>;

export type CachePlan = z.infer<typeof cachePlanSchema>;

export type CacheResult = z.infer<typeof cacheResultSchema>;

export type ClearCacheInput = {
  clientPath: string | null;
  ids: string[];
};
