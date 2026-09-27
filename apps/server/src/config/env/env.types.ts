import type { Env } from './env.schema';

export type UnsafeSettingsInput = {
  env: Env;
  nodeEnvSet: boolean;
};
