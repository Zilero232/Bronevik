import type { MiniAppPlatform } from '../../../lib/mini-app-mode';

export type SignInFailedProps = {
  isRetrying: boolean;
  platform: MiniAppPlatform;
  onRetry: () => void;
};
