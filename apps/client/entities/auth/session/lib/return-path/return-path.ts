import { isIncludedIn } from 'remeda';

import { ROUTES } from '@/shared/constants';
import { localePath, LOCALES } from '@/shared/i18n';

import type { ReturnUrlInput } from './return-path.types';

import { RETURN_PATH } from '../../config';

const withoutLocale = (pathname: string): string => {
  const [, first = '', ...rest] = pathname.split('/');

  return isIncludedIn(first, LOCALES) ? `/${rest.join('/')}` : pathname;
};

const isLoginPath = (pathname: string): boolean => pathname === ROUTES.auth.login || pathname.startsWith(`${ROUTES.auth.login}/`);

const parsePath = (value: string): URL | null => {
  try {
    return new URL(value, RETURN_PATH.origin);
  } catch {
    return null;
  }
};

export const safeReturnPath = (value: string | null | undefined): string | null => {
  if (!value?.startsWith('/')) {
    return null;
  }

  const url = parsePath(value);

  if (url?.origin !== RETURN_PATH.origin) {
    return null;
  }

  const pathname = withoutLocale(url.pathname);

  return isLoginPath(pathname) ? null : `${pathname}${url.search}${url.hash}`;
};

export const returnUrl = ({ path, locale, origin }: ReturnUrlInput): string => new URL(localePath({ path, locale }), origin).toString();
