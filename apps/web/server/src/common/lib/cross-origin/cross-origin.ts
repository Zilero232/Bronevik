import type { CrossOriginInput } from './cross-origin.types';

import { CROSS_ORIGIN } from './cross-origin.constants';

const safeMethods = new Set<string>(CROSS_ORIGIN.safeMethods);

export const isCrossOriginStateChange = ({ method, origin, fetchSite, cookie, allowed }: CrossOriginInput): boolean => {
  if (safeMethods.has(method.toUpperCase()) || !(cookie ?? '').includes(CROSS_ORIGIN.sessionCookie)) {
    return false;
  }

  if (origin) {
    return !allowed.includes(origin);
  }

  return fetchSite === CROSS_ORIGIN.crossSite;
};
