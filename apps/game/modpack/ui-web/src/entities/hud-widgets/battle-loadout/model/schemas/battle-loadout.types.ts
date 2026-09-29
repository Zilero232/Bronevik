import type * as z from 'zod/mini';

import type { battleLoadoutSchema } from './battle-loadout.schemas';

export type BattleLoadoutData = z.infer<typeof battleLoadoutSchema>;
