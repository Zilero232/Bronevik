import { SITE_NAV } from '@/shared/constants';

import type { ActiveNavHrefInput, NavHrefMatchInput } from './nav-match.types';

import { NAV_ALIASES } from '../../config';

export const isNavHrefMatch = ({ href, pathname }: NavHrefMatchInput): boolean => pathname === href || pathname.startsWith(`${href}/`);

const resolveAlias = (pathname: string): string => NAV_ALIASES.find(({ prefix }) => isNavHrefMatch({ href: prefix, pathname }))?.href ?? pathname;

export const activeNavHref = ({ hrefs, pathname }: ActiveNavHrefInput): string | null => {
  const resolved = resolveAlias(pathname);

  return hrefs
    .filter((href) => isNavHrefMatch({ href, pathname: resolved }))
    .reduce<string | null>((best, href) => (best && best.length >= href.length ? best : href), null);
};

const NAV_HREFS = [...SITE_NAV.groups.flatMap((group) => group.items.map((item) => item.href)), SITE_NAV.tools.href, SITE_NAV.plus.href];

export const activeSiteNav = (pathname: string) => {
  const href = activeNavHref({ hrefs: NAV_HREFS, pathname });
  const group = SITE_NAV.groups.find((entry) => entry.items.some((item) => item.href === href));

  return { href, groupKey: group?.key ?? null };
};
