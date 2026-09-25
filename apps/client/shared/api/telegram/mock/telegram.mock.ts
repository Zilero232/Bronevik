import type { TelegramLinkCode, TelegramStatus } from '@bronevik/schemas';

import { addMinutes } from 'date-fns';

import { isBrowser } from '@/shared/lib';

import { MOCK_AUTH } from '../../auth/auth.constants';
import { TELEGRAM_MOCK } from './telegram.mock.constants';

let status: TelegramStatus = { isLinked: true, username: TELEGRAM_MOCK.username, botUsername: TELEGRAM_MOCK.botUsername };

const code = () =>
  Array.from({ length: TELEGRAM_MOCK.codeLength }, () => TELEGRAM_MOCK.alphabet[Math.floor(Math.random() * TELEGRAM_MOCK.alphabet.length)]).join('');

export const mockTelegram = {
  status: () => status,
  issueCode: (): TelegramLinkCode => {
    const value = code();

    return {
      code: value,
      expiresAt: addMinutes(new Date(), TELEGRAM_MOCK.ttlMinutes).toISOString(),
      deepLink: `https://t.me/${TELEGRAM_MOCK.botUsername}?start=${value}`
    };
  },
  unlink: () => {
    status = { ...status, isLinked: false, username: null };
  },
  signIn: () => {
    if (isBrowser()) {
      window.localStorage.setItem(MOCK_AUTH.storageKey, MOCK_AUTH.signedIn);
    }
  }
};
