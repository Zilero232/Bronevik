import { ACCOUNT_NAV, ROUTES } from '@/shared/constants';

import type { IsActiveTabInput } from './active-tab.types';

export const isActiveTab = ({ href, pathname }: IsActiveTabInput): boolean =>
  href === ROUTES.account.overview ? pathname === href : pathname.startsWith(href);

export const activeSection = (pathname: string) =>
  ACCOUNT_NAV.flatMap(({ items }) => [...items]).find(({ href }) => isActiveTab({ href, pathname })) ?? ACCOUNT_NAV[0].items[0];
