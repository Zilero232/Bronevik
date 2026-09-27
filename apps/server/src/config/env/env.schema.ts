import { z } from 'zod';

import type { UnsafeSettingsInput } from './env.types';

import { LESTA_MOCK } from '../lesta-mock/lesta-mock.constants';
import { ENV_GUARD } from './env.constants';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),

  DATABASE_URL: z.url(),
  DATABASE_POOL_MAX: z.coerce.number().int().positive().optional(),
  REDIS_URL: z.url(),

  API_URL: z.url(),
  WEB_URL: z.url(),
  CORS_ORIGINS: z.string().default(''),

  BETTER_AUTH_SECRET: z.string().min(32),

  LESTA_APPLICATION_ID: z.string().default(''),
  LESTA_RPS: z.coerce.number().int().positive().default(20),
  LESTA_MOCK: z.enum(LESTA_MOCK.modes).default('auto'),

  TELEGRAM_BOT_TOKEN: z.string().default(''),
  TELEGRAM_BOT_USERNAME: z.string().default(''),
  TELEGRAM_WEBHOOK_URL: z.union([z.url(), z.literal('')]).default(''),
  TELEGRAM_WEBHOOK_SECRET: z.string().default(''),

  DISCORD_BOT_TOKEN: z.string().default(''),
  DISCORD_APPLICATION_ID: z.string().default(''),
  DISCORD_CLIENT_SECRET: z.string().default(''),

  VK_BOT_TOKEN: z.string().default(''),
  VK_GROUP_ID: z.coerce.number().int().nonnegative().default(0),
  VK_CALLBACK_CONFIRMATION: z.string().default(''),
  VK_CALLBACK_SECRET: z.string().default(''),
  VK_MINI_APP_ID: z.coerce.number().int().nonnegative().default(0),
  VK_MINI_APP_SECRET: z.string().default(''),
  VK_ID_CLIENT_ID: z.string().default(''),
  VK_ID_CLIENT_SECRET: z.string().default(''),

  VAPID_PUBLIC_KEY: z.string().default(''),
  VAPID_PRIVATE_KEY: z.string().default(''),
  VAPID_SUBJECT: z.string().default(''),

  SMTP_HOST: z.string().default(''),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_SECURE: z.stringbool().default(false),
  SMTP_USER: z.string().default(''),
  SMTP_PASSWORD: z.string().default(''),
  EMAIL_FROM: z.string().default(''),

  YOOKASSA_SHOP_ID: z.string().default(''),
  YOOKASSA_SECRET_KEY: z.string().default(''),
  YOOKASSA_RECURRING: z.stringbool().default(false),

  DONATIONALERTS_CLIENT_ID: z.string().default(''),
  DONATIONALERTS_CLIENT_SECRET: z.string().default(''),

  TWITCH_CLIENT_ID: z.string().default(''),
  TWITCH_CLIENT_SECRET: z.string().default(''),
  VK_LIVE_CLIENT_ID: z.string().default(''),
  VK_LIVE_CLIENT_SECRET: z.string().default(''),
  YOUTUBE_API_KEY: z.string().default(''),

  MOD_INGEST_SECRET: z.string().min(8),

  REPLAY_STORAGE: z.enum(['local', 's3']).default('local'),
  REPLAY_STORAGE_DIR: z.string().default('.data/replays'),
  S3_ENDPOINT: z.union([z.url(), z.literal('')]).default(''),
  S3_REGION: z.string().default('us-east-1'),
  S3_BUCKET: z.string().default(''),
  S3_ACCESS_KEY_ID: z.string().default(''),
  S3_SECRET_ACCESS_KEY: z.string().default(''),

  BULL_BOARD_PASSWORD: z.string().default('')
});

export type Env = z.infer<typeof envSchema>;

const localHosts = new Set<string>(ENV_GUARD.localHosts);

const isLocalUrl = (url: string): boolean => {
  const { hostname } = new URL(url);

  return localHosts.has(hostname) || hostname.endsWith(ENV_GUARD.localSuffix);
};

const wantsLestaMock = (env: Env): boolean =>
  env.LESTA_APPLICATION_ID === '' &&
  env.NODE_ENV !== 'production' &&
  (env.LESTA_MOCK === 'on' || (env.LESTA_MOCK === 'auto' && env.NODE_ENV === 'development' && isLocalUrl(env.API_URL)));

const unsafeSettings = ({ env, nodeEnvSet }: UnsafeSettingsInput): string[] => [
  ...(!nodeEnvSet && !isLocalUrl(env.API_URL) ? ['NODE_ENV must be set explicitly when the API is not on a local host'] : []),
  ...(env.NODE_ENV === 'production'
    ? ENV_GUARD.productionSecrets.filter((name) => ENV_GUARD.weakSecret.test(env[name])).map((name) => `${name} is a development placeholder`)
    : [])
];

const resolveLestaMock = (env: Env): Env =>
  wantsLestaMock(env) ? { ...env, LESTA_MOCK: 'on', LESTA_APPLICATION_ID: LESTA_MOCK.applicationId } : { ...env, LESTA_MOCK: 'off' };

export const validateEnv = (raw: Record<string, unknown>): Env => {
  const parsed = envSchema.safeParse(raw);

  if (!parsed.success) {
    throw new Error(`Invalid environment:\n${z.prettifyError(parsed.error)}`);
  }

  const problems = unsafeSettings({ env: parsed.data, nodeEnvSet: raw.NODE_ENV !== undefined && raw.NODE_ENV !== '' });

  if (problems.length > 0) {
    throw new Error(`Unsafe environment:\n${problems.join('\n')}`);
  }

  return resolveLestaMock(parsed.data);
};

export const isProduction = (env: Pick<Env, 'NODE_ENV'>): boolean => env.NODE_ENV === 'production';
