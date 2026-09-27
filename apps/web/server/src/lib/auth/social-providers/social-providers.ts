import type { SocialProvidersInput } from './social-providers.types';

export const socialProviders = (env: SocialProvidersInput) => ({
  ...(env.DISCORD_APPLICATION_ID && env.DISCORD_CLIENT_SECRET
    ? {
        discord: {
          clientId: env.DISCORD_APPLICATION_ID,
          clientSecret: env.DISCORD_CLIENT_SECRET,
          disableSignUp: true,
          disableImplicitSignUp: true
        }
      }
    : {}),
  ...(env.VK_ID_CLIENT_ID && env.VK_ID_CLIENT_SECRET
    ? {
        vk: {
          clientId: env.VK_ID_CLIENT_ID,
          clientSecret: env.VK_ID_CLIENT_SECRET,
          disableDefaultScope: true,
          disableSignUp: true,
          disableImplicitSignUp: true
        }
      }
    : {})
});
