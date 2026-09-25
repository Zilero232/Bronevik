import { isValid, parse } from '@telegram-apps/init-data-node';

import type { TelegramIdentity, VerifyWebAppInput } from './telegram-login.types';

import { WEBAPP_AUTH } from './webapp-auth.constants';

export const verifyWebAppInitData = ({
  initData,
  botToken,
  maxAgeSeconds = WEBAPP_AUTH.maxAgeSeconds
}: VerifyWebAppInput): TelegramIdentity | null => {
  if (!botToken || !initData || !isValid(initData, botToken, { expiresIn: maxAgeSeconds })) {
    return null;
  }

  try {
    const { user } = parse(initData);

    if (!user || user.is_bot) {
      return null;
    }

    return {
      telegramId: BigInt(user.id),
      username: user.username ?? null,
      name: user.username ?? user.first_name,
      languageCode: user.language_code ?? null
    };
  } catch {
    return null;
  }
};
