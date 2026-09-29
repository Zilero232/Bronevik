import * as z from 'zod/mini';

import { hudIconSchema } from '../../../../../shared/api/hud-protocol';

export const battleClockSchema = z.object({ time: z.string(), date: z.string(), timer: z.string(), big_timer: z.boolean(), icon: hudIconSchema });
