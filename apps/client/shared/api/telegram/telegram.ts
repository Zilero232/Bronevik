import type { TelegramLinkCode, TelegramStatus, TelegramWebLoginInput } from '@bronevik/schemas';

import { telegramLinkCodeSchema, telegramSessionTokenSchema, telegramStatusSchema } from '@bronevik/schemas';

import { api, bearerToken } from '../http';
import { fromSource } from '../source';
import { mockTelegram } from './mock/telegram.mock';
import { TELEGRAM_PATHS } from './telegram.constants';
import { webAppSessionSchema } from './telegram.schemas';

const WITH_SESSION = { withCredentials: true } as const;

export const getTelegramStatus = (): Promise<TelegramStatus> =>
  fromSource({
    mock: () => telegramStatusSchema.parse(mockTelegram.status()),
    fetch: async () => telegramStatusSchema.parse((await api.get(TELEGRAM_PATHS.status, WITH_SESSION)).data)
  });

export const issueTelegramCode = (): Promise<TelegramLinkCode> =>
  fromSource({
    mock: () => telegramLinkCodeSchema.parse(mockTelegram.issueCode()),
    fetch: async () => telegramLinkCodeSchema.parse((await api.post(TELEGRAM_PATHS.code, {}, WITH_SESSION)).data)
  });

export const unlinkTelegram = (): Promise<void> =>
  fromSource({
    mock: () => mockTelegram.unlink(),
    fetch: async () => {
      await api.delete(TELEGRAM_PATHS.status, WITH_SESSION);
    }
  });

export const redeemTelegramWebLogin = (input: TelegramWebLoginInput): Promise<void> =>
  fromSource({
    mock: () => mockTelegram.signIn(),
    fetch: async () => {
      const { token } = telegramSessionTokenSchema.parse((await api.post(TELEGRAM_PATHS.webLogin, input, WITH_SESSION)).data);

      bearerToken.set(token);
    }
  });

export const signInWithMiniApp = (initData: string): Promise<void> =>
  fromSource({
    mock: () => mockTelegram.signIn(),
    fetch: async () => {
      const { token } = webAppSessionSchema.parse((await api.post(TELEGRAM_PATHS.webApp, { initData }, WITH_SESSION)).data);

      bearerToken.set(token);
    }
  });
