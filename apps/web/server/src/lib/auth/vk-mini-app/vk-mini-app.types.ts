import type { setSessionCookie } from 'better-auth/cookies';

export type VkIdentity = {
  vkUserId: number;
  languageCode: string | null;
};

export type VerifyLaunchParamsInput = {
  launchParams: string;
  appId: number;
  appSecret: string;
  now?: Date;
  maxAgeSeconds?: number;
};

export type VkMiniAppOptions = {
  appId: number;
  appSecret: string;
};

export type SignInVkInput = {
  ctx: Parameters<typeof setSessionCookie>[0];
  identity: VkIdentity;
};
