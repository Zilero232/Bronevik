import { z } from 'zod';

import type { Env, UnsafeSettingsInput } from './env.types';

import { ENV_GUARD } from './env.constants';
import { envSchema } from './env.schemas';

const localHosts = new Set<string>(ENV_GUARD.localHosts);

const isLocalUrl = (url: string): boolean => {
  const { hostname } = new URL(url);

  return localHosts.has(hostname) || hostname.endsWith(ENV_GUARD.localSuffix);
};

const unsafeSettings = ({ env, nodeEnvSet }: UnsafeSettingsInput): string[] => [
  ...(!nodeEnvSet && !isLocalUrl(env.API_URL) ? ['NODE_ENV must be set explicitly when the API is not on a local host'] : []),
  ...(env.NODE_ENV === 'production'
    ? ENV_GUARD.productionSecrets.filter((name) => ENV_GUARD.weakSecret.test(env[name])).map((name) => `${name} is a development placeholder`)
    : [])
];

const lestaEgressProblems = (env: Env): string[] =>
  env.LESTA_EGRESS_IP !== '' && env.LESTA_EGRESS_IPS.length > 0 && !env.LESTA_EGRESS_IPS.includes(env.LESTA_EGRESS_IP)
    ? [`LESTA_EGRESS_IP ${env.LESTA_EGRESS_IP} is not one of LESTA_EGRESS_IPS`]
    : [];

export const validateEnv = (raw: Record<string, unknown>): Env => {
  const parsed = envSchema.safeParse(raw);

  if (!parsed.success) {
    throw new Error(`Invalid environment:\n${z.prettifyError(parsed.error)}`);
  }

  const invalid = lestaEgressProblems(parsed.data);

  if (invalid.length > 0) {
    throw new Error(`Invalid environment:\n${invalid.join('\n')}`);
  }

  const problems = unsafeSettings({ env: parsed.data, nodeEnvSet: raw.NODE_ENV !== undefined && raw.NODE_ENV !== '' });

  if (problems.length > 0) {
    throw new Error(`Unsafe environment:\n${problems.join('\n')}`);
  }

  return parsed.data;
};

export const isProduction = (env: Pick<Env, 'NODE_ENV'>): boolean => env.NODE_ENV === 'production';
