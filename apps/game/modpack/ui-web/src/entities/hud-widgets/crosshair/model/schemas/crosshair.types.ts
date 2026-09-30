import type * as z from 'zod/mini';

import type { crosshairSchema } from './crosshair.schemas';

export type CrosshairData = z.infer<typeof crosshairSchema>;
