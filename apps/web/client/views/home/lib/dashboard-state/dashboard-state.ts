import type { DashboardState, DashboardStateInput } from './dashboard-state.types';

export const dashboardState = ({ isReady, hasPlayer, hasProfile, isMissing, isError }: DashboardStateInput): DashboardState => {
  if (!isReady) {
    return 'pending';
  }

  if (!hasPlayer) {
    return 'ask';
  }

  if (hasProfile) {
    return 'ready';
  }

  if (isMissing) {
    return 'missing';
  }

  return isError ? 'error' : 'loading';
};
