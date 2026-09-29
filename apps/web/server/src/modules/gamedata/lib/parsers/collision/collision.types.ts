import type { z } from 'zod';

import type { collisionSchema, modelIndexSchema } from './collision.schemas';

export type CollisionFile = z.infer<typeof collisionSchema>;

export type ModelIndex = z.infer<typeof modelIndexSchema>;
