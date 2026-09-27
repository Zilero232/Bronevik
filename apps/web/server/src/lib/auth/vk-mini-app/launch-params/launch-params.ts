import { differenceInSeconds, fromUnixTime } from 'date-fns';
import { verifyAndParseLaunchParams } from 'vk-launch-params';

import type { VerifyLaunchParamsInput, VkIdentity } from '../vk-mini-app.types';

import { VK_MINI_APP_AUTH } from '../../auth.constants';

export const verifyVkLaunchParams = ({
  launchParams,
  appId,
  appSecret,
  now = new Date(),
  maxAgeSeconds = VK_MINI_APP_AUTH.maxAgeSeconds
}: VerifyLaunchParamsInput): VkIdentity | null => {
  if (!appSecret || !launchParams) {
    return null;
  }

  const params = verifyAndParseLaunchParams(launchParams.replace(/^\?/u, ''), appSecret);

  if (!params || !Number.isSafeInteger(params.vk_user_id) || params.vk_user_id <= 0) {
    return null;
  }

  if (appId > 0 && params.vk_app_id !== appId) {
    return null;
  }

  if (!Number.isFinite(params.vk_ts) || differenceInSeconds(now, fromUnixTime(params.vk_ts)) > maxAgeSeconds) {
    return null;
  }

  return { vkUserId: params.vk_user_id, languageCode: params.vk_language || null };
};
