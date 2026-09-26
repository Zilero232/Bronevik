import { apiKey } from '@better-auth/api-key';
import { API_KEY } from '@bronevik/schemas';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { admin, bearer, magicLink } from 'better-auth/plugins';

import type { CreateAuthInput } from './auth.types';

import { allowedOrigins, isProduction } from '../../config';
import { API_KEY_PLUGIN, SESSION } from './auth.constants';
import { lestaId } from './lesta-id';
import { telegramLogin } from './telegram-login';

export const createAuth = ({ env, prisma, lesta, lestaStore, telegramStore, logger }: CreateAuthInput) => {
  const magicLinkEnabled = !isProduction(env);

  return betterAuth({
    appName: 'Bronevik',
    basePath: '/auth',
    baseURL: env.API_URL,
    secret: env.BETTER_AUTH_SECRET,
    trustedOrigins: allowedOrigins(env),
    database: prismaAdapter(prisma, { provider: 'postgresql' }),
    advanced: {
      database: { generateId: 'uuid' }
    },
    session: {
      expiresIn: SESSION.expiresIn,
      updateAge: SESSION.updateAge
    },
    emailAndPassword: { enabled: false },
    plugins: [
      bearer(),
      admin(),
      apiKey({
        apiKeyHeaders: API_KEY.header.toLowerCase(),
        defaultPrefix: API_KEY_PLUGIN.prefix,
        defaultKeyLength: API_KEY_PLUGIN.keyLength,
        startingCharactersConfig: { shouldStore: true, charactersLength: API_KEY_PLUGIN.prefix.length + API_KEY.prefixLength },
        maximumNameLength: API_KEY.maxNameLength,
        enableMetadata: true,
        keyExpiration: { minExpiresIn: API_KEY_PLUGIN.minExpiresInDays, maxExpiresIn: API_KEY_PLUGIN.maxExpiresInDays },
        rateLimit: { enabled: false },
        schema: { apikey: { modelName: API_KEY_PLUGIN.modelName } }
      }),
      lestaId({ lesta, store: lestaStore, apiUrl: env.API_URL, webUrl: env.WEB_URL }),
      telegramLogin({ botToken: env.TELEGRAM_BOT_TOKEN, botUsername: env.TELEGRAM_BOT_USERNAME, store: telegramStore }),
      ...(magicLinkEnabled
        ? [
            magicLink({
              disableSignUp: false,
              sendMagicLink: async ({ email, url }) => {
                logger.log(`magic link for ${email}: ${url}`);
              }
            })
          ]
        : [])
    ]
  });
};
