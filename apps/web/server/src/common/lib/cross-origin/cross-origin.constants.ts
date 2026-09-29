import { AUTH_COOKIE } from '../../../config';

export const CROSS_ORIGIN = {
  safeMethods: ['GET', 'HEAD', 'OPTIONS'],
  sessionCookie: AUTH_COOKIE.session,
  crossSite: 'cross-site'
} as const;
