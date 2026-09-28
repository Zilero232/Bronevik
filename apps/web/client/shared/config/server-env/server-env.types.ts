import type { z } from 'zod';

import type { serverEnvSchema } from './server-env.schemas';

export type ServerEnv = z.infer<typeof serverEnvSchema>;
