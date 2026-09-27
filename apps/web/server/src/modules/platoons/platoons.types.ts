import type { z } from 'zod';

import type { Owned } from '../community-core';
import type { createPlatoonSchema, platoonPageSchema, platoonPostSchema, platoonQuerySchema } from './dto/platoons.schemas';

export type PlatoonView = z.infer<typeof platoonPostSchema>;
export type PlatoonQuery = z.output<typeof platoonQuerySchema>;
export type PlatoonPage = z.infer<typeof platoonPageSchema>;
export type CreatePlatoonRequest = z.output<typeof createPlatoonSchema> & Owned;
