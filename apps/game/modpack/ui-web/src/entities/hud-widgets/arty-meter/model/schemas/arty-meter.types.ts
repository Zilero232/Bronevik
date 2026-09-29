import type * as z from 'zod/mini';

import type { artyMeterSchema } from './arty-meter.schemas';

export type ArtyMeterData = z.infer<typeof artyMeterSchema>;
