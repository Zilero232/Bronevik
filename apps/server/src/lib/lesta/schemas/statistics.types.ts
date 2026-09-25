import type { z } from 'zod';

import type { battleStatsBlockSchema } from './statistics.schemas';

export type BattleStatsBlock = z.infer<typeof battleStatsBlockSchema>;
