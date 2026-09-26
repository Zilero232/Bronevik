import type { PushBrowserState } from '../api/push-browser';

export const PUSH_BROWSER = {
  readyTimeoutMs: 10_000
} as const;

export const INITIAL_PUSH_BROWSER: PushBrowserState = {
  isReady: false,
  isSupported: false,
  permission: 'default',
  isSubscribed: false
};
