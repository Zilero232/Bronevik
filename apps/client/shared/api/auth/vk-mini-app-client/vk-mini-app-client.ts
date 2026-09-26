import type { BetterAuthClientPlugin } from 'better-auth/client';

import type { MiniAppSession } from '../auth.types';

import { AUTH_CLIENT } from '../auth.constants';

export const vkMiniAppClient = () =>
  ({
    id: 'vk-mini-app',
    getActions: ($fetch) => ({
      vk: {
        miniApp: (launchParams: string) => $fetch<MiniAppSession>(AUTH_CLIENT.vkMiniAppPath, { method: 'POST', body: { launchParams } })
      }
    })
  }) satisfies BetterAuthClientPlugin;
