import type { BetterAuthClientPlugin } from 'better-auth/client';

import type { TelegramWebAppSession, TelegramWidgetConfig } from './auth.types';

import { AUTH_CLIENT } from './auth.constants';

export const telegramLoginClient = () =>
  ({
    id: 'telegram-login',
    getActions: ($fetch) => ({
      telegram: {
        widget: () => $fetch<TelegramWidgetConfig>(AUTH_CLIENT.telegramWidgetPath, { method: 'GET' }),
        callback: (payload: Record<string, number | string>) => $fetch<unknown>(AUTH_CLIENT.telegramCallbackPath, { method: 'POST', body: payload }),
        webApp: (initData: string) => $fetch<TelegramWebAppSession>(AUTH_CLIENT.telegramWebAppPath, { method: 'POST', body: { initData } })
      }
    })
  }) satisfies BetterAuthClientPlugin;
