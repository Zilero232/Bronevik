import { invokeCommand } from '@/shared/api';
import { COMMANDS } from '@/shared/config';

import type { ClearCacheInput } from './cache.types';

import { cachePlanSchema, cacheResultSchema } from './cache.schemas';

export const scanCache = (clientPath: string | null) => invokeCommand({ command: COMMANDS.scanCache, schema: cachePlanSchema, args: { clientPath } });

export const clearCache = ({ clientPath, ids }: ClearCacheInput) =>
  invokeCommand({ command: COMMANDS.clearCache, schema: cacheResultSchema, args: { clientPath, ids } });
