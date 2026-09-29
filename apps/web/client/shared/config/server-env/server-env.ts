import type { ServerEnv } from './server-env.types';

import { serverEnvSchema } from './server-env.schemas';

const cache: { value?: ServerEnv } = {};

export const serverEnv = (): ServerEnv => {
  cache.value ??= serverEnvSchema.parse({ INTERNAL_API_TOKEN: process.env.INTERNAL_API_TOKEN, LESTA_NOTICE: process.env.LESTA_NOTICE });

  return cache.value;
};
