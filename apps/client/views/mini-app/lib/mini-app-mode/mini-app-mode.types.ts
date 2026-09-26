import type { MutationStatus } from '@tanstack/react-query';

export type TelegramEnv = 'browser' | 'detecting' | 'telegram';

export type TelegramLaunch = {
  env: TelegramEnv;
  initData: string | null;
};

export type MiniAppMode = 'dashboard' | 'failed' | 'loading' | 'outside' | 'preview';

export type MiniAppModeInput = {
  env: TelegramEnv;
  signInStatus: MutationStatus;
  hasSession: boolean;
  isSessionPending: boolean;
};
