import { WRAPPED_YEAR } from './wrapped-year.constants';

export const latestWrappedYear = (now: Date): number => {
  const year = now.getUTCFullYear();
  const isOpen = now.getUTCMonth() === WRAPPED_YEAR.opensMonth && now.getUTCDate() >= WRAPPED_YEAR.opensDay;

  return isOpen ? year : year - 1;
};
