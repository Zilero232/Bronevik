import * as z from 'zod/mini';

import { hudIconSchema } from '../../../../../shared/api/hud-protocol';

export const crosshairSchema = z.object({
  mark: hudIconSchema,
  size: z.number(),
  hides_centre: z.boolean()
});
