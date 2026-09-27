import type { z } from 'zod';

import type { envSchema } from './env.schemas';

export type Env = z.infer<typeof envSchema>;

export type UnsafeSettingsInput = {
  env: Env;
  nodeEnvSet: boolean;
};
