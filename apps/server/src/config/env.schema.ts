import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),

  DATABASE_URL: z.url(),
  REDIS_URL: z.url(),

  API_URL: z.url(),
  WEB_URL: z.url(),
  CORS_ORIGINS: z.string().default(''),

  BETTER_AUTH_SECRET: z.string().min(32),

  LESTA_APPLICATION_ID: z.string().default(''),
  LESTA_RPS: z.coerce.number().int().positive().default(20),

  TELEGRAM_BOT_TOKEN: z.string().default(''),
  TELEGRAM_BOT_USERNAME: z.string().default(''),
  TELEGRAM_WEBHOOK_URL: z.union([z.url(), z.literal('')]).default(''),
  TELEGRAM_WEBHOOK_SECRET: z.string().default(''),

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

export const validateEnv = (raw: Record<string, unknown>): Env => {
  const parsed = envSchema.safeParse(raw);

  if (!parsed.success) {
    throw new Error(`Invalid environment:\n${z.prettifyError(parsed.error)}`);
  }

  return parsed.data;
};

export const isProduction = (env: Pick<Env, 'NODE_ENV'>): boolean => env.NODE_ENV === 'production';
