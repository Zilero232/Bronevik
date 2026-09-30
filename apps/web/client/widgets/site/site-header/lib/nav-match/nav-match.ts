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

const NAV_HREFS = [
  ...SITE_NAV.menu.flatMap((entry) => ('items' in entry ? entry.items.map((item) => item.href) : [entry.href])),
  SITE_NAV.hub.href,
  SITE_NAV.plus.href
];

export const activeSiteNav = (pathname: string) => {
  const href = activeNavHref({ hrefs: NAV_HREFS, pathname });
  const entry = SITE_NAV.menu.find((candidate) =>
    'items' in candidate ? candidate.items.some((item) => item.href === href) : candidate.href === href
  );

  return { href, entryKey: entry?.key ?? null };
};
