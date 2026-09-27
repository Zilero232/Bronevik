import type { AppConfigService } from '../../../../config';
import type { AuthEnv } from '../../../../lib/auth';

export const authEnv = (config: AppConfigService): AuthEnv => ({
  API_URL: config.get('API_URL'),
  BETTER_AUTH_SECRET: config.get('BETTER_AUTH_SECRET'),
  CORS_ORIGINS: config.get('CORS_ORIGINS'),
  DISCORD_APPLICATION_ID: config.get('DISCORD_APPLICATION_ID'),
  DISCORD_CLIENT_SECRET: config.get('DISCORD_CLIENT_SECRET'),
  NODE_ENV: config.get('NODE_ENV'),
  TELEGRAM_BOT_TOKEN: config.get('TELEGRAM_BOT_TOKEN'),
  TELEGRAM_BOT_USERNAME: config.get('TELEGRAM_BOT_USERNAME'),
  TRUSTED_PROXIES: config.get('TRUSTED_PROXIES'),
  VK_ID_CLIENT_ID: config.get('VK_ID_CLIENT_ID'),
  VK_ID_CLIENT_SECRET: config.get('VK_ID_CLIENT_SECRET'),
  VK_MINI_APP_ID: config.get('VK_MINI_APP_ID'),
  VK_MINI_APP_SECRET: config.get('VK_MINI_APP_SECRET'),
  WEB_URL: config.get('WEB_URL')
});
