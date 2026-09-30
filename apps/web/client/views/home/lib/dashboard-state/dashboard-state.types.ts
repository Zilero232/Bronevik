export type DashboardState = 'ask' | 'error' | 'loading' | 'missing' | 'pending' | 'ready';

export type DashboardStateInput = {
  isReady: boolean;
  hasPlayer: boolean;
  hasProfile: boolean;
  isMissing: boolean;
  isError: boolean;
};
