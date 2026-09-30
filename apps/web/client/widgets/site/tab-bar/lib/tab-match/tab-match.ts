import { ROUTES } from '@/shared/constants';

import { TAB_BAR } from '../../config';

const LINK_TABS = TAB_BAR.tabs.filter((tab) => 'href' in tab);

export const activeTabKey = (pathname: string): string | null =>
  LINK_TABS.find(({ href }) => (href === ROUTES.home ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)))?.key ?? null;
