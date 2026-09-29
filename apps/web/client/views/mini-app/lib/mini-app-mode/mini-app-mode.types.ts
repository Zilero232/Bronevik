import type { MutationStatus } from '@tanstack/react-query';

import type { MINI_APP_PLATFORMS } from '../../config';

export type MiniAppPlatform = (typeof MINI_APP_PLATFORMS)[number];

type MiniAppEnv = 'browser' | 'detecting' | 'inside';

export type MiniAppLaunch = {
  env: MiniAppEnv;
  payload: string | null;
};

export type MiniAppMode = 'dashboard' | 'failed' | 'loading' | 'outside' | 'preview';

export type MiniAppModeInput = {
  env: MiniAppEnv;
  signInStatus: MutationStatus;
  hasSession: boolean;
  isSessionPending: boolean;
};
