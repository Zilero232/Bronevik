import { isObjectType } from 'remeda';

import type { LestaIdentity, SafeCallbackUrlInput, VerifyLestaLoginInput, WithErrorInput } from './lesta-id.types';

import { LESTA_ERROR_CODE, LestaApiError } from '../../lesta';
import { LESTA_ID } from './lesta-id.constants';

export const verifyLestaLogin = async ({ login, lesta }: VerifyLestaLoginInput): Promise<LestaIdentity | null> => {
  try {
    const response = await lesta.account.info({
      accountIds: [login.accountId],
      accessToken: login.accessToken,
      fields: LESTA_ID.verifyFields
    });

    const info = response[String(login.accountId)];

    if (!info || info.account_id !== login.accountId || !isObjectType(info.private)) {
      return null;
    }

    return {
      accountId: login.accountId,
      nickname: info.nickname ?? login.nickname,
      accessToken: login.accessToken,
      expiresAt: new Date(login.expiresAt * 1000)
    };
  } catch (error) {
    if (error instanceof LestaApiError && error.code === LESTA_ERROR_CODE.invalidAccessToken) {
      return null;
    }

    throw error;
  }
};

export const safeCallbackUrl = ({ requested, webUrl }: SafeCallbackUrlInput): string => {
  if (!requested) {
    return webUrl;
  }

  try {
    const url = new URL(requested, webUrl);

    return url.origin === new URL(webUrl).origin ? url.toString() : webUrl;
  } catch {
    return webUrl;
  }
};

export const withError = ({ url, code }: WithErrorInput): string => {
  const target = new URL(url);

  target.searchParams.set(LESTA_ID.errorParam, code);

  return target.toString();
};
